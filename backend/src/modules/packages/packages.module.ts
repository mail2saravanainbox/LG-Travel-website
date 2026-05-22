import { Module } from "@nestjs/common";
import { PackagesController } from "./packages.controller";
import { PackagesService } from "./packages.service";
import { AdminGuard } from "../admin/admin.module";

@Module({
  controllers: [PackagesController],
  providers: [PackagesService, AdminGuard],
})
export class PackagesModule {}
