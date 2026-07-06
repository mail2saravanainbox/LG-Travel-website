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
import { DestinationsService } from "./destinations.service";
import { CreateDestinationDto, UpdateDestinationDto } from "./create-destination.dto";
import { AdminGuard } from "../admin/admin.module";

@Controller("destinations")
export class DestinationsController {
  constructor(private readonly service: DestinationsService) {}

  @Get()
  findAll(@Query("featured") featured?: string, @Query("continent") continent?: string) {
    return this.service.findAll({ featured, continent });
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateDestinationDto) {
    return this.service.create(dto);
  }

  // Declared before :slug so "reorder" isn't treated as a destination slug.
  @UseGuards(AdminGuard)
  @Patch("reorder")
  reorder(@Body() body: { ids: string[] }) {
    return this.service.reorder(body.ids ?? []);
  }

  @UseGuards(AdminGuard)
  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() dto: UpdateDestinationDto) {
    return this.service.update(slug, dto);
  }

  @UseGuards(AdminGuard)
  @Delete(":slug")
  remove(@Param("slug") slug: string) {
    return this.service.remove(slug);
  }

  @Get(":slug")
  findOne(@Param("slug") slug: string) {
    return this.service.findOne(slug);
  }
}
