import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePackageDto } from "./create-package.dto";

/** "Bali Honeymoon Escape" → "bali-honeymoon-escape" */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePackageDto) {
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.title);

    const existing = await this.prisma.package.findUnique({ where: { slug } });
    if (existing) {
      throw new ConflictException(`A package with slug "${slug}" already exists`);
    }

    // Optionally link an existing destination by slug.
    let destinationId: string | undefined;
    if (dto.destinationSlug) {
      const dest = await this.prisma.destination.findUnique({
        where: { slug: dto.destinationSlug },
      });
      destinationId = dest?.id;
    }

    return this.prisma.package.create({
      data: {
        slug,
        title: dto.title,
        summary: dto.summary,
        description: dto.description,
        location: dto.location,
        heroImage: dto.heroImage,
        gallery: dto.gallery ?? [],
        durationDays: dto.durationDays,
        durationNights: dto.durationNights,
        price: dto.price,
        oldPrice: dto.oldPrice,
        currency: dto.currency ?? "INR",
        groupSize: dto.groupSize,
        category: (dto.category ?? "Luxury") as never,
        highlights: dto.highlights ?? [],
        inclusions: dto.inclusions ?? [],
        exclusions: dto.exclusions ?? [],
        badge: dto.badge,
        isFeatured: dto.isFeatured ?? false,
        isActive: dto.isActive ?? true,
        destinationId,
        ...(dto.itinerary?.length
          ? {
              itinerary: {
                create: dto.itinerary.map((d) => ({
                  dayNumber: d.dayNumber,
                  title: d.title,
                  description: d.description,
                  stay: d.stay,
                  meals: d.meals ?? [],
                })),
              },
            }
          : {}),
      },
      include: { itinerary: { orderBy: { dayNumber: "asc" } } },
    });
  }

  findAll(params: { category?: string; featured?: string; sort?: string }) {
    let orderBy: Prisma.PackageOrderByWithRelationInput = { isFeatured: "desc" };
    if (params.sort === "price-asc") orderBy = { price: "asc" };
    else if (params.sort === "price-desc") orderBy = { price: "desc" };
    else if (params.sort === "rating") orderBy = { rating: "desc" };

    return this.prisma.package.findMany({
      where: {
        isActive: true,
        ...(params.category ? { category: params.category as never } : {}),
        ...(params.featured === "true" ? { isFeatured: true } : {}),
      },
      orderBy,
    });
  }

  async findOne(slug: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { slug },
      include: {
        itinerary: { orderBy: { dayNumber: "asc" } },
        destination: true,
        reviews: { where: { isPublished: true } },
      },
    });
    if (!pkg) throw new NotFoundException(`Package "${slug}" not found`);
    return pkg;
  }

  async related(slug: string) {
    const pkg = await this.prisma.package.findUnique({ where: { slug } });
    if (!pkg) throw new NotFoundException(`Package "${slug}" not found`);
    return this.prisma.package.findMany({
      where: { category: pkg.category, slug: { not: slug }, isActive: true },
      take: 3,
    });
  }
}
