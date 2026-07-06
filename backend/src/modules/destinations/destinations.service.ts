import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateDestinationDto, UpdateDestinationDto } from "./create-destination.dto";

/** "Bali Hidden Gems" → "bali-hidden-gems" */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { featured?: string; continent?: string }) {
    return this.prisma.destination.findMany({
      where: {
        ...(params.featured === "true" ? { isFeatured: true } : {}),
        ...(params.continent
          ? { continent: { equals: params.continent, mode: "insensitive" as const } }
          : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  }

  /** Set the manual display order: sortOrder = position in the given id list. */
  async reorder(ids: string[]) {
    await this.prisma.$transaction(
      ids.map((id, i) =>
        this.prisma.destination.update({ where: { id }, data: { sortOrder: i } }),
      ),
    );
    return { ok: true, count: ids.length };
  }

  async findOne(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: { packages: true },
    });
    if (!destination) throw new NotFoundException(`Destination "${slug}" not found`);
    return destination;
  }

  async create(dto: CreateDestinationDto) {
    const slug = dto.slug?.trim() ? slugify(dto.slug) : slugify(dto.name);
    const clash = await this.prisma.destination.findUnique({ where: { slug } });
    if (clash) throw new ConflictException(`A destination with slug "${slug}" already exists`);

    return this.prisma.destination.create({
      data: {
        slug,
        name: dto.name,
        country: dto.country,
        continent: dto.continent,
        tagline: dto.tagline,
        description: dto.description,
        heroImage: dto.heroImage,
        gallery: dto.gallery ?? (dto.heroImage ? [dto.heroImage] : []),
        startingPrice: dto.startingPrice ?? 0,
        currency: dto.currency ?? "INR",
        rating: dto.rating ?? 0,
        reviewCount: dto.reviewCount ?? 0,
        bestSeason: dto.bestSeason,
        highlights: dto.highlights ?? [],
        isFeatured: dto.isFeatured ?? false,
      },
    });
  }

  async update(slug: string, dto: UpdateDestinationDto) {
    const dest = await this.prisma.destination.findUnique({ where: { slug } });
    if (!dest) throw new NotFoundException(`Destination "${slug}" not found`);

    let nextSlug = dest.slug;
    if (dto.slug?.trim()) {
      nextSlug = slugify(dto.slug);
      if (nextSlug !== dest.slug) {
        const clash = await this.prisma.destination.findUnique({ where: { slug: nextSlug } });
        if (clash) throw new ConflictException(`A destination with slug "${nextSlug}" already exists`);
      }
    }

    return this.prisma.destination.update({
      where: { id: dest.id },
      data: {
        slug: nextSlug,
        name: dto.name,
        country: dto.country,
        continent: dto.continent,
        tagline: dto.tagline,
        description: dto.description,
        heroImage: dto.heroImage,
        gallery: dto.gallery,
        startingPrice: dto.startingPrice,
        currency: dto.currency,
        rating: dto.rating,
        reviewCount: dto.reviewCount,
        bestSeason: dto.bestSeason,
        highlights: dto.highlights,
        isFeatured: dto.isFeatured,
      },
    });
  }

  async remove(slug: string) {
    const dest = await this.prisma.destination.findUnique({
      where: { slug },
      include: { _count: { select: { packages: true } } },
    });
    if (!dest) throw new NotFoundException(`Destination "${slug}" not found`);
    if (dest._count.packages > 0) {
      throw new ConflictException(
        `Cannot delete "${slug}" — it has ${dest._count.packages} linked package(s). Reassign or delete those packages first.`,
      );
    }
    await this.prisma.destination.delete({ where: { id: dest.id } });
    return { deleted: true, slug };
  }
}
