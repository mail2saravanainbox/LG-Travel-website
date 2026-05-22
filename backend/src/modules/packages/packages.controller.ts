import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { PackagesService } from "./packages.service";
import { CreatePackageDto } from "./create-package.dto";
import { UpdatePackageDto } from "./update-package.dto";
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

  // Admin-only: edit an existing package.
  @UseGuards(AdminGuard)
  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() dto: UpdatePackageDto) {
    return this.service.update(slug, dto);
  }

  // Admin-only: delete a package (refused if it has bookings).
  @UseGuards(AdminGuard)
  @Delete(":slug")
  remove(@Param("slug") slug: string) {
    return this.service.remove(slug);
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
