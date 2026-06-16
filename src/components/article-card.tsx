import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";

interface Props {
  title: string;
  href: string;
  excerpt: string;
  image?: string;
  date?: string;
  categories?: string[];
  authorName?: string;
  className?: string;
}

export function ArticleCard({
  title,
  href,
  excerpt,
  image,
  date,
  categories,
  authorName,
  className,
}: Props) {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full group",
        className
      )}
    >
      <Link href={href} className="block cursor-pointer overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>
      <CardHeader className="px-4 py-3">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-lg leading-tight group-hover:text-primary transition-colors">
            <Link href={href}>{title}</Link>
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            {date && (
              <span className="flex items-center gap-1">
                <CalendarIcon className="size-3" />
                {new Date(date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {authorName && <span>• {authorName}</span>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {excerpt}
        </p>
      </CardContent>
      <CardFooter className="px-4 pb-4 pt-0 mt-auto">
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {categories.map((category) => (
              <Badge
                className="px-2 py-0.5 text-[10px]"
                variant="secondary"
                key={category}
              >
                {category}
              </Badge>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
