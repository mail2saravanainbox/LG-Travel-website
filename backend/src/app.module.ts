import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthController } from "./health/health.controller";
import { DestinationsModule } from "./modules/destinations/destinations.module";
import { PackagesModule } from "./modules/packages/packages.module";
import { TestimonialsModule } from "./modules/testimonials/testimonials.module";
import { InquiriesModule } from "./modules/inquiries/inquiries.module";
import { BookingsModule } from "./modules/bookings/bookings.module";
import { AdminModule } from "./modules/admin/admin.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DestinationsModule,
    PackagesModule,
    TestimonialsModule,
    InquiriesModule,
    BookingsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
