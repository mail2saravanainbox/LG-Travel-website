import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { fetchBlogPosts } from "@/services/blog.service";
import { PageHeader } from "@/components/shared/page-header";
import { Reveal, RevealGroup } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Travel Journal",
  description: "Stories, guides and inspiration from the LG Travels team of specialists.",
};

export default async function BlogPage() {
  const posts = await fetchBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <PageHeader
        eyebrow="The Journal"
        title="Stories & inspiration from the road"
        description="Guides, ideas and behind-the-scenes from our travel designers."
        image="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?auto=format&fit=crop&w=2000&q=80"
        crumbs={[{ label: "Blog" }]}
      />

      <section className="container-lux py-16 md:py-24">
        {/* Featured */}
        <Reveal>
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-soft transition-shadow hover:shadow-lift lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
              <Image
                src={featured.cover}
                alt={featured.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <Badge variant="gold" className="w-fit">{featured.category}</Badge>
              <h2 className="mt-4 font-display text-2xl font-bold text-navy-900 md:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-ink/65">{featured.excerpt}</p>
              <div className="mt-6 flex items-center gap-3 text-sm text-ink/50">
                <Image src={featured.author.avatar} alt={featured.author.name} width={36} height={36} className="rounded-full" />
                <span>{featured.author.name}</span>
                <span>·</span>
                <span>{formatDate(featured.publishedAt)}</span>
                <span className="ml-auto inline-flex items-center gap-1.5 font-semibold text-gold-600">
                  Read <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Grid */}
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Reveal key={post.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-navy-700/8 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-lift">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={post.cover}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <Badge variant="glass" className="absolute left-4 top-4">{post.category}</Badge>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="flex items-center gap-1.5 text-xs text-ink/50">
                    <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-navy-900">
                    <Link href={`/blog/${post.slug}`} className="after:absolute">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-ink/60">{post.excerpt}</p>
                  <span className="mt-4 text-xs text-ink/40">{formatDate(post.publishedAt)}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
