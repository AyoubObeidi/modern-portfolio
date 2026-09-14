import Image from "next/image";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

type ProjectMediaProps = {
  project: Project;
  sizes: string;
  className?: string;
};

export function ProjectMedia({ project, sizes, className }: ProjectMediaProps) {
  const image = project.images[0];

  if (!image) {
    // Typographic fallback until a real screenshot is added.
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex aspect-16/10 flex-col justify-between rounded-xl border border-line bg-surface p-6 md:p-8",
          className,
        )}
      >
        <span className="font-mono text-xs text-muted">/{project.slug}</span>
        <div>
          <p className="text-4xl font-semibold tracking-tight text-bone md:text-5xl">{project.title}</p>
          <p className="mt-3 font-mono text-xs text-muted">{project.stack.slice(0, 4).join(" · ")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-line bg-surface", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className="h-auto w-full transition-transform duration-500 ease-out-expo group-hover:scale-102"
      />
    </div>
  );
}
