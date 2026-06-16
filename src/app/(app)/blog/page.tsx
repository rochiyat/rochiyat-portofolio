import BlurFade from "@/components/magicui/blur-fade";
import { ArticleCard } from "@/components/article-card";
import { getArticles } from "@/sanity/lib/queries";
import { portableTextToPlainText } from "@/lib/utils";

const BLUR_FADE_DELAY = 0.04;
export const revalidate = 604800; // 1 week

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="blog-header" className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Blog
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground max-w-[600px] md:text-xl">
            Thoughts, insights, and stories about web development, design, and my journey.
          </p>
        </BlurFade>
      </section>

      <section id="blog-articles">
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, id) => (
              <BlurFade
                key={article._id}
                delay={BLUR_FADE_DELAY * 3 + id * 0.05}
              >
                <ArticleCard
                  title={article.title ?? ""}
                  href={`/blog/${article.slug?.current ?? ""}`}
                  excerpt={article.excerpt ?? ""}
                  image={article.coverImage?.asset?.url ?? undefined}
                  date={article.publishedAt ?? undefined}
                  categories={article.categories ?? []}
                  authorName={article.author?.name ?? undefined}
                />
              </BlurFade>
            ))}
          </div>
        ) : (
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="text-muted-foreground text-center py-12 border rounded-lg bg-muted/20">
              No articles found. Check back later!
            </p>
          </BlurFade>
        )}
      </section>
    </div>
  );
}
