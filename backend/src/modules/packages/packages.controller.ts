import { Controller, Get, Param, Query } from "@nestjs/common";
import { PackagesService } from "./packages.service";

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

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.service.findOne(slug);
  }

  @Get(":slug/related")
  related(@Param("slug") slug: string) {
    return this.service.related(slug);
  }
}
