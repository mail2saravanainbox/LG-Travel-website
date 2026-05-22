import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(params: { featured?: string; continent?: string }) {
    return this.prisma.destination.findMany({
      where: {
        ...(params.featured === "true" ? { isFeatured: true } : {}),
        ...(params.continent ? { continent: params.continent } : {}),
      },
      orderBy: { name: "asc" },
    });
  }

  async findOne(slug: string) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug },
      include: { packages: true },
    });
    if (!destination) throw new NotFoundException(`Destination "${slug}" not found`);
    return destination;
  }
}
