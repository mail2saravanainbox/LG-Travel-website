import { Controller, Get, Injectable, Module } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}
  findAll() {
    return this.prisma.testimonial.findMany({ orderBy: { createdAt: "desc" } });
  }
}

@Controller("testimonials")
export class TestimonialsController {
  constructor(private readonly service: TestimonialsService) {}
  @Get()
  findAll() {
    return this.service.findAll();
  }
}

@Module({
  controllers: [TestimonialsController],
  providers: [TestimonialsService],
})
export class TestimonialsModule {}
