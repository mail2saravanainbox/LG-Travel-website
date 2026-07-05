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
import { MediaModule } from "./modules/media/media.module";
import { BlogModule } from "./modules/blog/blog.module";
import { SettingsModule } from "./modules/settings/settings.module";
import { EmailModule } from "./modules/email/email.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    EmailModule,
    DestinationsModule,
    PackagesModule,
    TestimonialsModule,
    InquiriesModule,
    BookingsModule,
    AdminModule,
    MediaModule,
    BlogModule,
    SettingsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
