import type { Metadata } from "next";
import Link from "next/link";
import { BlogTagFilter } from "@/components/BlogTagFilter";
import { EventCoverImage } from "@/components/EventCoverImage";
import { getBlogTagLabel } from "@/lib/blog-tags";
import { fetchPublishedBlogs, toBlogPost } from "@/lib/blogs-db";

export const metadata: Metadata = {
  title: "Blog | DJ Ludzy",
  description:
    "Music, mixes, and thoughts from DJ Ludzy — house, UK garage, nu disco, and more across Suffolk and East Anglia.",
};

export const revalidate = 60;

type Props = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogPage({ searchParams }: Props) {
  const { tag } = await searchParams;
  const activeTag = tag?.trim() || null;
  const fromDb = await fetchPublishedBlogs(activeTag);
  const posts = (fromDb ?? []).map(toBlogPost);

  return (
    <main className="relative min-h-screen text-white">
      <section className="relative flex min-h-[50vh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-12 md:pb-20 lg:px-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/35">
              <li>
                <Link href="/" className="transition hover:text-white/60">
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/55">Blog</li>
            </ol>
          </nav>
          <p className="text-[11px] font-medium uppercase tracking-[0.4em] text-white/40">
            Music &amp; thoughts
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.92] tracking-[-0.01em] text-white md:text-5xl lg:text-7xl">
            Blog
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/50 md:text-lg">
            Reads on genres Ludzy plays, nights out, and what&apos;s on the decks.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-16 md:px-12 md:py-24 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
            Filter by genre
          </p>
          <div className="mt-4">
            <BlogTagFilter activeTag={activeTag} />
          </div>

          {activeTag && (
            <p className="mt-6 text-sm text-white/45">
              Showing posts tagged{" "}
              <span className="text-white/70">{getBlogTagLabel(activeTag)}</span>
            </p>
          )}

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.length === 0 ? (
              <p className="text-sm text-white/40 sm:col-span-2 lg:col-span-3">
                {activeTag ? "No posts for this tag yet." : "No blog posts published yet."}
              </p>
            ) : (
              posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex max-w-[420px] flex-col border border-white/10 bg-black p-5 transition hover:border-white/25 hover:bg-white/[0.03] md:p-6"
                >
                  {post.imageUrl && (
                    <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden">
                      <EventCoverImage
                        src={post.imageUrl}
                        alt=""
                        className="h-full w-full object-cover brightness-75"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
                      {post.date}
                    </p>
                    <h2 className="mt-2 font-display text-lg font-bold uppercase tracking-[0.06em] text-white/90 transition group-hover:text-white md:text-xl">
                      {post.title}
                    </h2>
                    {post.tagsLabel && (
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-white/35">
                        {post.tagsLabel}
                      </p>
                    )}
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-white/45 transition group-hover:text-white/60">
                      {post.excerpt}
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 transition group-hover:text-white">
                    Read post
                    <svg
                      className="h-3 w-3 transition-transform group-hover:translate-x-1"
                      viewBox="0 0 12 12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M2.5 6h7M6.5 2.5 10 6l-3.5 3.5" />
                    </svg>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
