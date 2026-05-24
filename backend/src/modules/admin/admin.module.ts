import {
  Body,
  CanActivate,
  Controller,
  ExecutionContext,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { IsEnum, IsOptional, IsString } from "class-validator";
import * as crypto from "crypto";
import { PrismaService } from "../../prisma/prisma.service";

const SECRET = process.env.ADMIN_TOKEN_SECRET || "lg-admin-dev-secret";
const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "LGtravels@2026";
const EIGHT_HOURS = 8 * 60 * 60 * 1000;

function signToken(username: string): string {
  const payload = { sub: username, role: "admin", exp: Date.now() + EIGHT_HOURS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifyToken(token?: string): { sub: string; role: string } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  if (sig !== expected) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    if (p.exp && Date.now() > p.exp) return null;
    return p;
  } catch {
    return null;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const auth: string = req.headers["authorization"] || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : undefined;
    const payload = verifyToken(token);
    if (!payload) throw new UnauthorizedException("Invalid or expired admin session");
    req.admin = payload;
    return true;
  }
}

class LoginDto {
  @IsString() username!: string;
  @IsString() password!: string;
}

enum BookingStatusDto {
  pending = "pending",
  confirmed = "confirmed",
  cancelled = "cancelled",
  completed = "completed",
  refunded = "refunded",
}

class UpdateBookingDto {
  @IsOptional() @IsEnum(BookingStatusDto) status?: BookingStatusDto;
  @IsOptional() @IsString() notes?: string;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async stats() {
    const [bookings, leads, packages, destinations] = await Promise.all([
      this.prisma.booking.findMany(),
      this.prisma.inquiry.count(),
      this.prisma.package.count(),
      this.prisma.destination.count(),
    ]);
    const revenue = bookings.reduce((sum, b) => sum + Number(b.total), 0);
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    return {
      totalBookings: bookings.length,
      confirmedBookings: confirmed,
      totalRevenue: revenue,
      totalLeads: leads,
      totalPackages: packages,
      totalDestinations: destinations,
    };
  }

  bookings() {
    return this.prisma.booking.findMany({
      orderBy: { createdAt: "desc" },
      include: { package: { select: { title: true } } },
    });
  }

  async updateBooking(reference: string, dto: UpdateBookingDto) {
    const booking = await this.prisma.booking.findUnique({ where: { reference } });
    if (!booking) throw new NotFoundException(`Booking "${reference}" not found`);
    return this.prisma.booking.update({
      where: { id: booking.id },
      data: { status: dto.status as never, notes: dto.notes },
      include: { package: { select: { title: true } } },
    });
  }

  inquiries() {
    return this.prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  }

  packages() {
    return this.prisma.package.findMany({ orderBy: { createdAt: "desc" } });
  }
}

@Controller("admin")
export class AdminController {
  constructor(private readonly svc: AdminService) {}

  @Post("login")
  login(@Body() dto: LoginDto) {
    if (dto.username === ADMIN_USER && dto.password === ADMIN_PASS) {
      return { token: signToken(dto.username), user: { username: dto.username, role: "admin" } };
    }
    throw new UnauthorizedException("Invalid username or password");
  }

  @UseGuards(AdminGuard)
  @Get("stats")
  stats() {
    return this.svc.stats();
  }

  @UseGuards(AdminGuard)
  @Get("bookings")
  bookings() {
    return this.svc.bookings();
  }

  @UseGuards(AdminGuard)
  @Patch("bookings/:reference")
  updateBooking(@Param("reference") reference: string, @Body() dto: UpdateBookingDto) {
    return this.svc.updateBooking(reference, dto);
  }

  @UseGuards(AdminGuard)
  @Get("inquiries")
  inquiries() {
    return this.svc.inquiries();
  }

  @UseGuards(AdminGuard)
  @Get("packages")
  packages() {
    return this.svc.packages();
  }
}

@Module({
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
