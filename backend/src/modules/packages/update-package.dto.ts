import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from "class-validator";
import { ItineraryDayDto, PackageCategoryDto, TripTypeDto } from "./create-package.dto";

/** All fields optional — only the keys you send get changed. */
export class UpdatePackageDto {
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() slug?: string;

  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() location?: string;

  @IsOptional() @IsString() heroImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];

  @IsOptional() @IsInt() @Min(1) durationDays?: number;
  @IsOptional() @IsInt() @Min(0) durationNights?: number;

  @IsOptional() @IsNumber() @Min(0) price?: number;
  @IsOptional() @IsNumber() @Min(0) oldPrice?: number;
  @IsOptional() @IsString() currency?: string;

  @IsOptional() @IsString() groupSize?: string;
  @IsOptional() @IsEnum(PackageCategoryDto) category?: PackageCategoryDto;
  @IsOptional() @IsEnum(TripTypeDto) tripType?: TripTypeDto;

  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) inclusions?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) exclusions?: string[];

  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;

  @IsOptional() @IsString() destinationSlug?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDto)
  itinerary?: ItineraryDayDto[];
}
