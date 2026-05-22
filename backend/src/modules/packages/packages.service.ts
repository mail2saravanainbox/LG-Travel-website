import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

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
