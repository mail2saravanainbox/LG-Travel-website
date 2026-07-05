import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { ClerkAuthGuard, ClerkAuthModule } from "../auth/clerk-auth.module";
import { EmailService } from "../email/email.module";

export class CreateBookingDto {
  @IsString() @IsNotEmpty() packageSlug!: string;
  @IsInt() @Min(1) travelers!: number;
  @IsOptional() @IsString() startDate?: string;
  @IsString() @IsNotEmpty() leadName!: string;
  @IsEmail() leadEmail!: string;
  @IsOptional() @IsString() leadPhone?: string;
}

const ref = () => "LG-" + Math.random().toString(36).slice(2, 8).toUpperCase();

@Injectable()
export class BookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}

  async create(dto: CreateBookingDto, clerkUserId?: string) {
    const pkg = await this.prisma.package.findUnique({ where: { slug: dto.packageSlug } });
    if (!pkg) throw new NotFoundException(`Package "${dto.packageSlug}" not found`);

    const subtotal = Number(pkg.price) * dto.travelers;
    const taxes = Math.round(subtotal * 0.05);

    // Link to the signed-in Clerk user, creating a lightweight User row on first booking.
    let userId: string | undefined;
    if (clerkUserId) {
      const user = await this.prisma.user.upsert({
        where: { clerkId: clerkUserId },
        update: {},
        create: { clerkId: clerkUserId, email: dto.leadEmail, fullName: dto.leadName },
      });
      userId = user.id;
    }

    const booking = await this.prisma.booking.create({
      data: {
        reference: ref(),
        packageId: pkg.id,
        userId,
        travelers: dto.travelers,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        leadName: dto.leadName,
        leadEmail: dto.leadEmail,
        leadPhone: dto.leadPhone,
        subtotal,
        taxes,
        total: subtotal + taxes,
        currency: pkg.currency,
        status: "pending",
      },
    });

    // Best-effort staff alert + customer acknowledgement (never throws).
    this.email.sendBookingEmails(
      {
        reference: booking.reference,
        leadName: booking.leadName,
        leadEmail: booking.leadEmail,
        leadPhone: booking.leadPhone,
        travelers: booking.travelers,
        startDate: booking.startDate,
        total: booking.total.toString(),
        currency: booking.currency,
      },
      pkg.title,
    );

    return booking;
  }

  async findOne(reference: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { reference },
      include: { package: true, payments: true },
    });
    if (!booking) throw new NotFoundException(`Booking "${reference}" not found`);
    return booking;
  }

  // Bookings belonging to the signed-in Clerk user (for the customer dashboard).
  async findMine(clerkUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    });
    if (!user) return [];
    return this.prisma.booking.findMany({
      where: { userId: user.id },
      include: { package: true, payments: true },
      orderBy: { createdAt: "desc" },
    });
  }
}

@Controller("bookings")
export class BookingsController {
  constructor(private readonly service: BookingsService) {}

  // Creating a booking requires a signed-in Clerk user.
  @UseGuards(ClerkAuthGuard)
  @Post()
  create(@Body() dto: CreateBookingDto, @Req() req: { auth?: { userId: string } }) {
    return this.service.create(dto, req.auth?.userId);
  }

  // The signed-in user's own bookings. Declared before the :reference route so
  // "mine" is matched as a static path, not treated as a booking reference.
  @UseGuards(ClerkAuthGuard)
  @Get("mine")
  findMine(@Req() req: { auth?: { userId: string } }) {
    return this.service.findMine(req.auth?.userId ?? "");
  }

  // Confirmation lookup stays public so emailed/booking-reference links work.
  @Get(":reference")
  findOne(@Param("reference") reference: string) {
    return this.service.findOne(reference);
  }
}

@Module({
  imports: [ClerkAuthModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
