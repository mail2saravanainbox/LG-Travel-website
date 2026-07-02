import {
  Body,
  Controller,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminGuard } from "../admin/admin.module";

/**
 * Generic key/value settings store. The site keeps one row with key="site"
 * containing brand/contact/social fields editable from the admin panel.
 */
@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(key: string) {
    const row = await this.prisma.setting.findUnique({ where: { key } });
    return row?.value ?? null;
  }

  async upsert(key: string, value: unknown) {
    return this.prisma.setting.upsert({
      where: { key },
      create: { key, value: value as never },
      update: { value: value as never },
    });
  }
}

@Controller("settings")
export class SettingsController {
  constructor(private readonly svc: SettingsService) {}

  // Public: anyone (incl. the public site) can read settings.
  @Get(":key")
  async get(@Param("key") key: string) {
    const value = await this.svc.get(key);
    // Return a clean 404 for an unknown key rather than a 200 with an empty body
    // (an empty body makes the client's res.json() throw a parse error).
    if (value == null) throw new NotFoundException(`No settings for key "${key}"`);
    return value;
  }

  // Admin-only: upsert a settings blob by key.
  @UseGuards(AdminGuard)
  @Put(":key")
  upsert(@Param("key") key: string, @Body() body: unknown) {
    return this.svc.upsert(key, body);
  }
}

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, AdminGuard],
})
export class SettingsModule {}
