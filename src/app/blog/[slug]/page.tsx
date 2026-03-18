import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BLOG_POSTS } from "../posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  return {
    title: `${post.title} | AreaIQ Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://www.area-iq.co.uk/blog/${post.slug}`,
      publishedTime: post.date,
      images: [{ url: `/blog/${slug}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
    alternates: { canonical: `https://www.area-iq.co.uk/blog/${post.slug}` },
  };
}

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let listItems: string[] = [];
  let orderedItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="mb-6 pl-5 space-y-2">
          {listItems.map((item, idx) => (
            <li
              key={idx}
              className="text-[15px] leading-[1.75] pl-1"
              style={{ color: "var(--text-secondary)", listStyleType: "disc" }}
            >
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
    if (orderedItems.length > 0) {
      elements.push(
        <ol key={`ol-${elements.length}`} className="mb-6 pl-5 space-y-2">
          {orderedItems.map((item, idx) => (
            <li
              key={idx}
              className="text-[15px] leading-[1.75] pl-1"
              style={{ color: "var(--text-secondary)", listStyleType: "decimal" }}
            >
              <span dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
            </li>
          ))}
        </ol>
      );
      orderedItems = [];
    }
  }

  function inlineFormat(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--text-primary); font-weight: 600;">$1</strong>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color: var(--accent); text-decoration: underline;">$1</a>');
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={i}
          className="text-[20px] font-semibold tracking-tight mt-10 mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3
          key={i}
          className="text-[17px] font-semibold mt-8 mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          {line.slice(4)}
        </h3>
      );
    } else if (/^[0-9]+\. /.test(line)) {
      const text = line.replace(/^[0-9]+\.\s+/, "");
      orderedItems.push(text);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      listItems.push(line.slice(2));
    } else if (line.trim() === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={i}
          className="text-[15px] leading-[1.8] mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          <span dangerouslySetInnerHTML={{ __html: inlineFormat(line) }} />
        </p>
      );
    }
    i++;
  }
  flushList();

  return elements;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const postIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const nextPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const prevPost = postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col bg-grid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { "@type": "Organization", name: "AreaIQ", url: "https://www.area-iq.co.uk" },
            publisher: { "@type": "Organization", name: "AreaIQ", url: "https://www.area-iq.co.uk" },
            mainEntityOfPage: `https://www.area-iq.co.uk/blog/${post.slug}`,
            keywords: post.tags,
          }),
        }}
      />
      <Navbar breadcrumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]} maxWidth="720px">
        <Link
          href="/report"
          className="h-8 px-4 flex items-center gap-2 text-[11px] font-mono font-medium uppercase tracking-wide transition-colors"
          style={{ background: "var(--text-primary)", color: "var(--bg)" }}
        >
          Go to App
          <ArrowRight size={12} />
        </Link>
      </Navbar>

      <main className="flex-1 max-w-[720px] w-full mx-auto px-6 py-14">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
              {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5 text-[12px] font-mono" style={{ color: "var(--text-tertiary)" }}>
              <Clock size={12} />
              {post.readTime} read
            </span>
          </div>
          <h1
            className="text-[28px] md:text-[34px] font-semibold tracking-tight leading-[1.2] mb-5"
            style={{ color: "var(--text-primary)" }}
          >
            {post.title}
          </h1>
          <p className="text-[16px] leading-[1.7]" style={{ color: "var(--text-secondary)" }}>
            {post.description}
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono uppercase tracking-wider px-2 py-1"
                style={{ color: "var(--text-tertiary)", border: "1px solid var(--border)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="border-t mb-10" style={{ borderColor: "var(--border)" }} />

        {/* Content */}
        <article>{renderMarkdown(post.content)}</article>

        {/* CTA */}
        <div
          className="mt-14 border p-8 md:p-10 text-center"
          style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        >
          <div
            className="text-[10px] font-mono uppercase tracking-widest mb-3"
            style={{ color: "var(--text-tertiary)" }}
          >
            Try it yourself
          </div>
          <h3
            className="text-[20px] font-semibold tracking-tight mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Score any UK postcode in seconds
          </h3>
          <p className="text-[14px] leading-relaxed mb-6 max-w-md mx-auto" style={{ color: "var(--text-tertiary)" }}>
            7 live data sources. Deterministic scoring. AI-generated narrative. 3 free reports per month.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/sign-up"
              className="px-6 py-2.5 text-[12px] font-mono font-medium tracking-wide transition-colors"
              style={{ background: "var(--text-primary)", color: "var(--bg)" }}
            >
              Start for free
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-2.5 text-[12px] font-mono font-medium tracking-wide border transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              View pricing
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="border p-5 transition-colors group"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <div
                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                <ArrowLeft size={11} /> Previous
              </div>
              <div
                className="text-[13px] font-medium leading-snug group-hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                {prevPost.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="border p-5 text-right transition-colors group"
              style={{ borderColor: "var(--border)", background: "var(--bg)" }}
            >
              <div
                className="flex items-center justify-end gap-1.5 text-[10px] font-mono uppercase tracking-wider mb-2"
                style={{ color: "var(--text-tertiary)" }}
              >
                Next <ArrowRight size={11} />
              </div>
              <div
                className="text-[13px] font-medium leading-snug group-hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-primary)" }}
              >
                {nextPost.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Back to blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="text-[12px] font-mono inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            <ArrowLeft size={11} /> All posts
          </Link>
        </div>
      </main>

      <Footer maxWidth="720px" />
    </div>
  );
}
