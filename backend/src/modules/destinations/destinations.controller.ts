import { Controller, Get, Param, Query } from "@nestjs/common";
import { DestinationsService } from "./destinations.service";

@Controller("destinations")
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  findAll(@Query("featured") featured?: string, @Query("continent") continent?: string) {
    return this.service.findAll({ featured, continent });
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.service.findOne(slug);
  }
}
