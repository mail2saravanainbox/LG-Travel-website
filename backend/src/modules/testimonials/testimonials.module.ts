import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminGuard } from "../admin/admin.module";

export class CreateTestimonialDto {
  @IsString() @MinLength(2) name!: string;
  @IsString() @MinLength(1) quote!: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() trip?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class UpdateTestimonialDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() @MinLength(1) quote?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() trip?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsInt() @Min(1) @Max(5) rating?: number;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.testimonial.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  }

  create(dto: CreateTestimonialDto) {
    return this.prisma.testimonial.create({
      data: {
        name: dto.name,
        quote: dto.quote,
        location: dto.location,
        trip: dto.trip,
        avatarUrl: dto.avatarUrl,
        rating: dto.rating ?? 5,
        isFeatured: dto.isFeatured ?? false,
      },
    });
  }

  async update(id: string, dto: UpdateTestimonialDto) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Testimonial "${id}" not found`);
    return this.prisma.testimonial.update({
      where: { id },
      data: {
        name: dto.name,
        quote: dto.quote,
        location: dto.location,
        trip: dto.trip,
        avatarUrl: dto.avatarUrl,
        rating: dto.rating,
        isFeatured: dto.isFeatured,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.testimonial.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Testimonial "${id}" not found`);
    await this.prisma.testimonial.delete({ where: { id } });
    return { deleted: true, id };
  }
}

@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateTestimonialDto) {
    return this.service.create(dto);
  }

  @UseGuards(AdminGuard)
  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateTestimonialDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.remove(id);
  }
}

@Module({
  controllers: [TestimonialsController],
  providers: [TestimonialsService, AdminGuard],
})
export class TestimonialsModule {}
