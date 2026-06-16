import Image from "next/image";
import Link from "next/link";
import { PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <figure className="my-8 w-full">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border">
            <Image
              src={urlFor(value).url()}
              alt={value.alt || "Image"}
              fill
              className="object-cover"
            />
          </div>
          {value.alt && (
            <figcaption className="text-center text-sm text-muted-foreground mt-2">
              {value.alt}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }) => {
      // Basic fallback if shiki is not integrated at portabletext level
      // We rely on standard code blocks being styled by globals.css
      return (
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4 text-sm font-mono border">
          <code>{value.code}</code>
        </pre>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-12 mb-4 scroll-m-20 border-b pb-2">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mt-8 mb-4 scroll-m-20">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold mt-6 mb-4 scroll-m-20">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-6 border-l-2 border-primary pl-6 italic text-muted-foreground bg-muted/50 py-2 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith("/")
        ? "noreferrer noopener"
        : undefined;
      const target = !value.href.startsWith("/") ? "_blank" : undefined;
      return (
        <Link
          href={value.href}
          rel={rel}
          target={target}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
        >
          {children}
        </Link>
      );
    },
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2 text-muted-foreground">
        {children}
      </ol>
    ),
  },
};
