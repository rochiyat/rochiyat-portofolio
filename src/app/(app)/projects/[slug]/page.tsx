import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { ChevronLeftIcon, GithubIcon, GlobeIcon, CalendarIcon } from "lucide-react";
import BlurFade from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { portableTextComponents } from "@/components/portable-text-components";
import { ImageGallery } from "@/components/image-gallery";
import { getProjectBySlug, getProjects } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

const BLUR_FADE_DELAY = 0.04;
export const revalidate = 604800; // 1 week

export async function generateStaticParams() {
  const projects = await client.fetch<Array<{ slug: { current: string } | null }>>(`
    *[_type == "project"] {
      slug {
        current
      }
    }
  `);
  return projects
    .filter((p) => p?.slug?.current)
    .map((project) => ({
      slug: project.slug!.current,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: `Case study for ${project.title}`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const startYear = project.startDate ? new Date(project.startDate).getFullYear() : null;
  const endYear = project.endDate ? new Date(project.endDate).getFullYear() : "Present";
  const period = startYear ? `${startYear} - ${endYear}` : null;

  return (
    <article className="flex flex-col min-h-[100dvh] pb-16">
      <BlurFade delay={BLUR_FADE_DELAY}>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeftIcon className="size-4" />
          Back to Projects
        </Link>
      </BlurFade>

      <header className="space-y-6 mb-10">
        <div className="space-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 2}>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </BlurFade>
          
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {period && (
                <div className="flex items-center gap-1">
                  <CalendarIcon className="size-4" />
                  <span>{period}</span>
                </div>
              )}
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={BLUR_FADE_DELAY * 4}>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>
        </BlurFade>

        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <div className="flex flex-wrap gap-3 pt-4">
            {project.demoUrl && (
              <Button asChild>
                <Link href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                  <GlobeIcon className="size-4 mr-2" />
                  Live Demo
                </Link>
              </Button>
            )}
            {project.links?.map((link, idx) => (
              <Button key={idx} variant="outline" asChild>
                <Link href={link.url ?? "#"} target="_blank" rel="noopener noreferrer">
                  {link.type === "code" ? (
                    <GithubIcon className="size-4 mr-2" />
                  ) : (
                    <GlobeIcon className="size-4 mr-2" />
                  )}
                  {link.title}
                </Link>
              </Button>
            ))}
          </div>
        </BlurFade>
      </header>

      {/* Hero Image or Video */}
      <BlurFade delay={BLUR_FADE_DELAY * 6}>
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border mb-12 bg-muted">
          {project.video ? (
            <iframe
              src={project.video}
              title={`${project.title} Video`}
              className="w-full h-full object-cover"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
            />
          ) : project.image?.asset?.url ? (
            <Image
              src={project.image.asset.url}
              alt={project.title ?? "Project Hero"}
              fill
              className="object-cover"
              priority
            />
          ) : null}
        </div>
      </BlurFade>

      {/* Content */}
      <div className="space-y-12">
        {project.description && (
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <section className="prose prose-neutral dark:prose-invert max-w-none text-lg">
              <PortableText value={project.description} />
            </section>
          </BlurFade>
        )}

        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <BlurFade delay={BLUR_FADE_DELAY * 8}>
            <section>
              <h2 className="text-2xl font-bold mb-6 border-b pb-2">Gallery</h2>
              <ImageGallery
                images={project.gallery.map((img) => ({
                  asset: img.asset
                    ? { url: img.asset.url ?? undefined }
                    : undefined,
                }))}
              />
            </section>
          </BlurFade>
        )}

        {/* Long Description / Case Study */}
        {project.longDescription && (
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <section className="prose prose-neutral dark:prose-invert max-w-none prose-img:rounded-xl prose-img:border">
              <PortableText
                value={project.longDescription}
                components={portableTextComponents}
              />
            </section>
          </BlurFade>
        )}
      </div>
    </article>
  );
}
