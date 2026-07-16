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
import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminGuard } from "../admin/admin.module";

/** Collapse whitespace runs and trim — admins paste addresses out of documents. */
const Clean = () =>
  Transform(({ value }) =>
    typeof value === "string" ? value.replace(/\s+/g, " ").trim() : value,
  );

/** Reject `javascript:` and other non-web schemes in admin-supplied links. */
const HTTP_URL = { protocols: ["http", "https"], require_protocol: true };

class SocialLinksDto {
  @Clean() @IsUrl(HTTP_URL) instagram!: string;
  @Clean() @IsUrl(HTTP_URL) facebook!: string;
  @Clean() @IsUrl(HTTP_URL) linkedin!: string;
}

class HeroDto {
  @Clean() @IsString() @IsNotEmpty() designerEyebrow!: string;
  @Clean() @IsString() @IsNotEmpty() designerTitle!: string;
  @Clean() @IsString() @IsNotEmpty() trendingEyebrow!: string;
  @Clean() @IsString() @IsNotEmpty() trendingBadge!: string;
  @Clean() @IsString() @IsNotEmpty() trendingTitle!: string;
  @Clean() @IsString() @IsNotEmpty() trendingSubtitle!: string;
  @Clean() @IsString() @IsNotEmpty() trendingPrice!: string;
  @Clean() @IsString() @IsNotEmpty() trendingRating!: string;
}

/**
 * The `site` blob, mirroring SiteSettings on the frontend.
 *
 * PUT replaces the row wholesale and the global ValidationPipe runs with
 * `whitelist: true`, so every field the admin panel sends MUST be declared
 * here — an omission is silently stripped and thus wiped from the row.
 */
export class SiteSettingsDto {
  @Clean() @IsString() @IsNotEmpty() name!: string;
  @Clean() @IsString() @IsNotEmpty() tagline!: string;
  @Clean() @IsString() @IsNotEmpty() description!: string;
  @Clean() @IsEmail() email!: string;
  @Clean() @IsString() @IsNotEmpty() phone!: string;
  @Clean() @IsString() @IsNotEmpty() hours!: string;
  @Clean() @IsString() @IsNotEmpty() addressLabel!: string;
  @Clean() @IsString() @IsNotEmpty() address!: string;
  @IsBoolean() internationalEnabled!: boolean;
  // @IsDefined/@IsObject are load-bearing: ValidateNested alone ignores a missing
  // object, so a payload without `social`/`hero` would pass and wipe it from the row.
  @IsDefined() @IsObject() @ValidateNested() @Type(() => SocialLinksDto) social!: SocialLinksDto;
  @IsDefined() @IsObject() @ValidateNested() @Type(() => HeroDto) hero!: HeroDto;
}

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

  // Admin-only: replace the `site` blob. Validated + normalized by SiteSettingsDto.
  // Deliberately not a generic `:key` route — a wildcard write would have to accept
  // an unvalidated body, which is what let malformed values into the row before.
  @UseGuards(AdminGuard)
  @Put("site")
  upsertSite(@Body() body: SiteSettingsDto) {
    return this.svc.upsert("site", body);
  }
}

@Module({
  controllers: [SettingsController],
  providers: [SettingsService, AdminGuard],
})
export class SettingsModule {}
