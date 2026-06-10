import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventGalleryDeck } from "@/components/EventGalleryDeck";
import { PreviousEventHero } from "@/components/PreviousEventHero";
import { fetchBlogBySlug, toBlogPost } from "@/lib/blogs-db";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dbBlog = await fetchBlogBySlug(slug);
  if (!dbBlog) return { title: "Blog | DJ Ludzy" };

  const post = toBlogPost(dbBlog);
  return { title: `${post.title} | DJ Ludzy Blog`, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const dbBlog = await fetchBlogBySlug(slug);
  if (!dbBlog) notFound();

  const post = toBlogPost(dbBlog);
  const metaLines = [post.date, post.tagsLabel].filter(Boolean);

  return (
    <main className="relative min-h-screen text-white">
      <div className="border-b border-white/10 px-6 py-6 md:px-12 lg:px-20">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl">
          <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
            <li>
              <Link href="/" className="transition hover:text-white/60">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="transition hover:text-white/60">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="max-w-[12rem] truncate text-white/55 sm:max-w-none">
              {post.title}
            </li>
          </ol>
        </nav>
      </div>

      <PreviousEventHero
        title={post.title}
        imageUrl={post.imageUrl}
        eyebrow="Blog"
        metaLines={metaLines}
      />

      <section className="px-6 pb-20 pt-14 md:px-12 md:pb-32 md:pt-20 lg:px-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-relaxed text-white/70 md:text-xl md:leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-10 space-y-6">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-white/55">
                {paragraph}
              </p>
            ))}
          </div>

          {post.galleryImages && post.galleryImages.length > 0 && (
            <EventGalleryDeck images={post.galleryImages} alt={post.title} />
          )}

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-10">
            <Link
              href="/blog"
              className="test-btn-ghost inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              ← All posts
            </Link>
            <Link
              href="/contact"
              className="test-btn-primary inline-flex items-center px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.3em]"
            >
              Book Ludzy
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
