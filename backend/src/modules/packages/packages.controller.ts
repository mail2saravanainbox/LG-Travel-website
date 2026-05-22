import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { PackagesService } from "./packages.service";
import { CreatePackageDto } from "./create-package.dto";
import { AdminGuard } from "../admin/admin.module";

@Controller("packages")
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  @Get()
  findAll(
    @Query("category") category?: string,
    @Query("featured") featured?: string,
    @Query("sort") sort?: string,
  ) {
    return this.service.findAll({ category, featured, sort });
  }

  // Admin-only: create a new package (with optional itinerary).
  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreatePackageDto) {
    return this.service.create(dto);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.service.findOne(slug);
  }

  @Get(":slug/related")
  related(@Param("slug") slug: string) {
    return this.service.related(slug);
  }
}
