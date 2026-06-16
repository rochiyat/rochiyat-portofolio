import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { getProjects } from "@/sanity/lib/queries";

const BLUR_FADE_DELAY = 0.04;
export const revalidate = 604800; // 1 week

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-10">
      <section id="projects-header" className="space-y-4">
        <BlurFade delay={BLUR_FADE_DELAY}>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Projects
          </h1>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <p className="text-muted-foreground max-w-[600px] md:text-xl">
            A comprehensive list of projects I&apos;ve worked on, ranging from simple websites to complex applications.
          </p>
        </BlurFade>
      </section>

      <section id="projects-list">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, id) => (
              <BlurFade
                key={project._id}
                delay={BLUR_FADE_DELAY * 3 + id * 0.05}
              >
                <ProjectCard
                  title={project.title ?? ""}
                  href={project.links?.[0]?.url ?? ""}
                  slug={project.slug?.current ? { current: project.slug.current } : undefined}
                  description={project.description ?? []}
                  tags={project.technologies ?? []}
                  image={project.image?.asset?.url ?? ""}
                  video={project.video ?? ""}
                  links={project.links ?? []}
                />
              </BlurFade>
            ))}
          </div>
        ) : (
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <p className="text-muted-foreground text-center py-12 border rounded-lg bg-muted/20">
              No projects found. Check back later!
            </p>
          </BlurFade>
        )}
      </section>
    </div>
  );
}
