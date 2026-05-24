import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";

export class CreateDestinationDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() slug?: string;

  @IsString() @MinLength(2) country!: string;
  @IsString() @MinLength(2) continent!: string;

  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsString() description?: string;

  @IsOptional() @IsString() heroImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];

  @IsOptional() @IsNumber() @Min(0) startingPrice?: number;
  @IsOptional() @IsString() currency?: string;

  @IsOptional() @IsNumber() @Min(0) rating?: number;
  @IsOptional() @IsInt() @Min(0) reviewCount?: number;

  @IsOptional() @IsString() bestSeason?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];

  @IsOptional() @IsBoolean() isFeatured?: boolean;
}

export class UpdateDestinationDto {
  @IsOptional() @IsString() @MinLength(2) name?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() @MinLength(2) country?: string;
  @IsOptional() @IsString() @MinLength(2) continent?: string;
  @IsOptional() @IsString() tagline?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() heroImage?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) gallery?: string[];
  @IsOptional() @IsNumber() @Min(0) startingPrice?: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() @IsNumber() @Min(0) rating?: number;
  @IsOptional() @IsInt() @Min(0) reviewCount?: number;
  @IsOptional() @IsString() bestSeason?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) highlights?: string[];
  @IsOptional() @IsBoolean() isFeatured?: boolean;
}
