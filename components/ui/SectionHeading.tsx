import { RevealText } from "@/components/ui/RevealText";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  index: string;
  label: string;
  title: string;
  className?: string;
};

export function SectionHeading({ id, index, label, title, className }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-baseline md:gap-10", className)}>
      <p className="font-mono text-sm text-muted md:w-40 md:shrink-0">
        <span className="text-accent">{index}</span> / {label}
      </p>
      <RevealText id={id} as="h2" text={title} className="text-title font-semibold text-balance" />
    </div>
  );
}
