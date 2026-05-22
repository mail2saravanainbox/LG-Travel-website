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

export enum PackageCategoryDto {
  Luxury = "Luxury",
  Honeymoon = "Honeymoon",
  Adventure = "Adventure",
  Family = "Family",
  Wellness = "Wellness",
  Cultural = "Cultural",
}

export class ItineraryDayDto {
  @IsInt() @Min(1) dayNumber!: number;
  @IsString() @MinLength(1) title!: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() stay?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) meals?: string[];
}

export class CreatePackageDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() slug?: string;

  @IsOptional() @IsString() summary?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() location?: string;

  @IsOptional() @IsString() heroImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];

  @IsInt() @Min(1) durationDays!: number;
  @IsInt() @Min(0) durationNights!: number;

  @IsNumber() @Min(0) price!: number;
  @IsOptional() @IsNumber() @Min(0) oldPrice?: number;
  @IsOptional() @IsString() currency?: string;

  @IsOptional() @IsString() groupSize?: string;
  @IsOptional() @IsEnum(PackageCategoryDto) category?: PackageCategoryDto;

  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) inclusions?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) exclusions?: string[];

  @IsOptional() @IsString() badge?: string;
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;

  /** Optional: link to an existing destination by its slug. */
  @IsOptional() @IsString() destinationSlug?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItineraryDayDto)
  itinerary?: ItineraryDayDto[];
}
