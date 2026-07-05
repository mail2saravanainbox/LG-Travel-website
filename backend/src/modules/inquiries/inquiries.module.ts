import { Body, Controller, Injectable, Module, Post } from "@nestjs/common";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { EmailService } from "../email/email.module";

export class CreateInquiryDto {
  @IsString() @IsNotEmpty() name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() destination?: string;
  @IsOptional() @IsString() budget?: string;
  @IsString() @MinLength(10) message!: string;
}

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService,
  ) {}
  async create(data: CreateInquiryDto) {
    const inquiry = await this.prisma.inquiry.create({ data });
    // Best-effort staff alert + customer acknowledgement (never throws).
    this.email.sendInquiryEmails(inquiry);
    return inquiry;
  }
  findAll() {
    return this.prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  }
}

@Controller("inquiries")
export class InquiriesController {
  constructor(private readonly service: InquiriesService) {}
  @Post()
  create(@Body() dto: CreateInquiryDto) {
    return this.service.create(dto);
  }
  // Leads are read only via the admin-guarded GET /admin/inquiries.
  // A public list route here would expose all customer PII, so it is intentionally omitted.
}

@Module({
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}
