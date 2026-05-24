import { Module } from "@nestjs/common";
import { DestinationsController } from "./destinations.controller";
import { DestinationsService } from "./destinations.service";
import { AdminGuard } from "../admin/admin.module";

@Module({
  controllers: [DestinationsController],
  providers: [DestinationsService, AdminGuard],
})
export class DestinationsModule {}
