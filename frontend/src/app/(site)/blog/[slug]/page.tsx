import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { fetchBlogPost, fetchBlogPosts, fetchBlogSlugs } from "@/services/blog.service";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return (await fetchBlogSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", images: [post.cover] },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) notFound();

  const more = (await fetchBlogPosts()).filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article>
      {/* Hero */}
      <header className="relative flex min-h-[60vh] items-end overflow-hidden pt-18">
        <Image src={post.cover} alt={post.title} fill priority className="object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="container-lux relative z-10 pb-12 pt-28 text-white">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to journal
          </Link>
          <Badge variant="gold" className="mt-4 w-fit">{post.category}</Badge>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-3xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <Image src={post.author.avatar} alt={post.author.name} width={40} height={40} className="rounded-full ring-2 ring-white/30" />
            <div>
              <p className="font-medium text-white">{post.author.name}</p>
              <p className="text-xs">{post.author.role}</p>
            </div>
            <span className="ml-4 flex items-center gap-1.5">
              <Clock className="h-4 w-4" /> {post.readingTime} min · {formatDate(post.publishedAt)}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container-lux max-w-3xl py-16">
        <div className="space-y-6 text-lg leading-relaxed text-ink/75">
          {post.content.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="rounded-full bg-mist px-3 py-1 text-sm text-navy-700">
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* More posts */}
      <section className="bg-mist py-16">
        <div className="container-lux">
          <h2 className="font-display text-2xl font-bold text-navy-900">Keep reading</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="group overflow-hidden rounded-3xl bg-white shadow-soft transition-shadow hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={p.cover} alt={p.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-gold-600">{p.category}</p>
                  <h3 className="mt-1 font-display text-base font-semibold text-navy-900">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
