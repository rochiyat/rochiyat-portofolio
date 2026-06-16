import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ChevronLeftIcon, CalendarIcon, ClockIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { portableTextComponents } from "@/components/portable-text-components";
import { getArticleBySlug, getArticles } from "@/sanity/lib/queries";
import { portableTextToPlainText } from "@/lib/utils";
import { client } from "@/sanity/lib/client";

const BLUR_FADE_DELAY = 0.04;
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  const articles = await client.fetch<Array<{ slug: { current: string } | null }>>(`
    *[_type == "article"] {
      slug {
        current
      }
    }
  `);
  return articles
    .filter((a) => a?.slug?.current)
    .map((article) => ({
      slug: article.slug!.current,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt || "Read this article",
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
      authors: [article.author?.name],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Very rough reading time estimate
  const plainText = portableTextToPlainText(article.content || []);
  const wordCount = plainText.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article className="flex flex-col min-h-[100dvh] pb-16">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeftIcon className="size-4" />
          Back to Blog
        </Link>
      </BlurFade>

      <header className="space-y-6 mb-10">
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            {article.categories && article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.categories.map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
            )}
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl text-balance">
              {article.title}
            </h1>
          </BlurFade>
          
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
              {article.author && (
                <div className="flex items-center gap-2">
                  <Avatar className="size-6 border">
                    <AvatarImage src={article.author.avatar?.asset?.url ?? undefined} />
                    <AvatarFallback>{article.author.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {article.author.name}
                  </span>
                </div>
              )}
              {article.publishedAt && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-4" />
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-1">
                <ClockIcon className="size-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
          </BlurFade>
        </div>
      </header>

      {article.coverImage?.asset?.url && (
        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border mb-12">
            <Image
              src={article.coverImage.asset.url}
              alt={article.title ?? "Cover Image"}
              fill
              className="object-cover"
              priority
            />
          </div>
        </BlurFade>
      )}

      <BlurFade delay={BLUR_FADE_DELAY * 5}>
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-xl prose-img:border">
          {article.content ? (
            <PortableText value={article.content} components={portableTextComponents} />
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </BlurFade>
    </article>
  );
}
