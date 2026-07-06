import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CreatePackageDto, PackageCategoryDto, TripTypeDto } from "./create-package.dto";
import { UpdatePackageDto } from "./update-package.dto";

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
        tripType: (dto.tripType ?? "international") as never,
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

  async update(slug: string, dto: UpdatePackageDto) {
    const pkg = await this.prisma.package.findUnique({ where: { slug } });
    if (!pkg) throw new NotFoundException(`Package "${slug}" not found`);

    // Allow renaming the slug (must stay unique).
    let nextSlug = pkg.slug;
    if (dto.slug?.trim()) {
      nextSlug = slugify(dto.slug);
      if (nextSlug !== pkg.slug) {
        const clash = await this.prisma.package.findUnique({ where: { slug: nextSlug } });
        if (clash) throw new ConflictException(`A package with slug "${nextSlug}" already exists`);
      }
    }

    // Optional destination relink by slug.
    let destinationId: string | null | undefined;
    if (dto.destinationSlug !== undefined) {
      if (dto.destinationSlug) {
        const dest = await this.prisma.destination.findUnique({
          where: { slug: dto.destinationSlug },
        });
        destinationId = dest?.id ?? null;
      } else {
        destinationId = null;
      }
    }

    // Only `undefined` fields are left unchanged by Prisma.
    return this.prisma.$transaction(async (tx) => {
      if (dto.itinerary) {
        await tx.itinerary.deleteMany({ where: { packageId: pkg.id } });
      }
      return tx.package.update({
        where: { id: pkg.id },
        data: {
          slug: nextSlug,
          title: dto.title,
          summary: dto.summary,
          description: dto.description,
          location: dto.location,
          heroImage: dto.heroImage,
          gallery: dto.gallery,
          durationDays: dto.durationDays,
          durationNights: dto.durationNights,
          price: dto.price,
          oldPrice: dto.oldPrice,
          currency: dto.currency,
          groupSize: dto.groupSize,
          category: dto.category as never,
          tripType: dto.tripType as never,
          highlights: dto.highlights,
          inclusions: dto.inclusions,
          exclusions: dto.exclusions,
          badge: dto.badge,
          isFeatured: dto.isFeatured,
          isActive: dto.isActive,
          destinationId,
          ...(dto.itinerary
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
    });
  }

  async remove(slug: string) {
    const pkg = await this.prisma.package.findUnique({
      where: { slug },
      include: { _count: { select: { bookings: true } } },
    });
    if (!pkg) throw new NotFoundException(`Package "${slug}" not found`);
    if (pkg._count.bookings > 0) {
      throw new ConflictException(
        `Cannot delete "${slug}" — it has ${pkg._count.bookings} booking(s). Deactivate it instead (set isActive=false) to hide it from the site.`,
      );
    }
    await this.prisma.package.delete({ where: { id: pkg.id } });
    return { deleted: true, slug };
  }

  findAll(params: { category?: string; featured?: string; sort?: string; tripType?: string }) {
    let orderBy:
      | Prisma.PackageOrderByWithRelationInput
      | Prisma.PackageOrderByWithRelationInput[] = [
      { sortOrder: "asc" },
      { isFeatured: "desc" },
    ];
    if (params.sort === "price-asc") orderBy = { price: "asc" };
    else if (params.sort === "price-desc") orderBy = { price: "desc" };
    else if (params.sort === "rating") orderBy = { rating: "desc" };

    // Only apply the enum filters when the value is a real member — Prisma throws
    // (→ 500) on any unknown enum value, so an invalid/mistyped/lowercased query
    // param (?category=luxury) is silently ignored rather than crashing the endpoint.
    const category = (Object.values(PackageCategoryDto) as string[]).includes(
      params.category ?? "",
    )
      ? params.category
      : undefined;
    const tripType = (Object.values(TripTypeDto) as string[]).includes(params.tripType ?? "")
      ? params.tripType
      : undefined;

    return this.prisma.package.findMany({
      where: {
        isActive: true,
        ...(category ? { category: category as never } : {}),
        ...(params.featured === "true" ? { isFeatured: true } : {}),
        ...(tripType ? { tripType: tripType as never } : {}),
      },
      orderBy,
    });
  }

  /** Set the manual display order: sortOrder = position in the given id list. */
  async reorder(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, i) => this.prisma.package.update({ where: { id }, data: { sortOrder: i } })),
    );
    return { ok: true, count: ids.length };
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
