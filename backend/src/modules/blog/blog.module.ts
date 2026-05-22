import {
  Body,
  Controller,
  ConflictException,
  Delete,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { PrismaService } from "../../prisma/prisma.service";
import { AdminGuard } from "../admin/admin.module";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Rough reading time from word count (~200 wpm). */
function estimateReadingTime(content?: string): number {
  const words = content ? content.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

export class CreateBlogPostDto {
  @IsString() @MinLength(2) title!: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsInt() @Min(1) readingTime?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  /** Defaults to true — published posts appear on the public site immediately. */
  @IsOptional() @IsBoolean() published?: boolean;
}

export class UpdateBlogPostDto {
  @IsOptional() @IsString() @MinLength(2) title?: string;
  @IsOptional() @IsString() slug?: string;
  @IsOptional() @IsString() excerpt?: string;
  @IsOptional() @IsString() content?: string;
  @IsOptional() @IsString() coverImage?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsInt() @Min(1) readingTime?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsBoolean() published?: boolean;
}

@Injectable()
export class BlogService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: { author: true },
    });
  }

  async findOne(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: { author: true },
    });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    return post;
  }

  async create(dto: CreateBlogPostDto) {
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.title);
    const clash = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (clash) throw new ConflictException(`A post with slug "${slug}" already exists`);

    const published = dto.published !== false; // default published
    return this.prisma.blogPost.create({
      data: {
        slug,
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        category: dto.category,
        readingTime: dto.readingTime ?? estimateReadingTime(dto.content),
        tags: dto.tags ?? [],
        status: published ? "published" : "draft",
        publishedAt: published ? new Date() : null,
      },
    });
  }

  async update(slug: string, dto: UpdateBlogPostDto) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);

    let nextSlug = post.slug;
    if (dto.slug?.trim()) {
      nextSlug = slugify(dto.slug);
      if (nextSlug !== post.slug) {
        const clash = await this.prisma.blogPost.findUnique({ where: { slug: nextSlug } });
        if (clash) throw new ConflictException(`A post with slug "${nextSlug}" already exists`);
      }
    }

    // Toggle status only when `published` is explicitly sent.
    let status: "published" | "draft" | undefined;
    let publishedAt: Date | null | undefined;
    if (dto.published !== undefined) {
      status = dto.published ? "published" : "draft";
      publishedAt = dto.published ? (post.publishedAt ?? new Date()) : null;
    }

    return this.prisma.blogPost.update({
      where: { id: post.id },
      data: {
        slug: nextSlug,
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        coverImage: dto.coverImage,
        category: dto.category,
        readingTime: dto.readingTime,
        tags: dto.tags,
        status: status as never,
        publishedAt,
      },
    });
  }

  async remove(slug: string) {
    const post = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new NotFoundException(`Post "${slug}" not found`);
    await this.prisma.blogPost.delete({ where: { id: post.id } });
    return { deleted: true, slug };
  }
}

@Controller("blog")
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  create(@Body() dto: CreateBlogPostDto) {
    return this.service.create(dto);
  }

  @UseGuards(AdminGuard)
  @Patch(":slug")
  update(@Param("slug") slug: string, @Body() dto: UpdateBlogPostDto) {
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

@Module({
  controllers: [BlogController],
  providers: [BlogService, AdminGuard],
})
export class BlogModule {}
