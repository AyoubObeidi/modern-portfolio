import { icons as logos } from "@iconify-json/logos";
import { icons as solar } from "@iconify-json/solar";
import { getIconData, iconToSVG } from "@iconify/utils";
import type { IconifyJSON } from "@iconify/types";

const registry = {
  "arrow-up-right": [solar, "arrow-right-up-linear"],
  "arrow-right": [solar, "arrow-right-linear"],
  "arrow-left": [solar, "arrow-left-linear"],
  mail: [solar, "letter-linear"],
  document: [solar, "document-text-linear"],
  code: [solar, "code-square-linear"],
  menu: [solar, "hamburger-menu-linear"],
  close: [solar, "close-square-linear"],
  github: [logos, "github-icon"],
  linkedin: [logos, "linkedin-icon"],
  whatsapp: [logos, "whatsapp-icon"],
} satisfies Record<string, readonly [IconifyJSON, string]>;

export type IconName = keyof typeof registry;

type IconProps = {
  name: IconName;
  className?: string;
};

// Rendered to inline SVG on the server: no client JS, no runtime icon fetch.
export function Icon({ name, className }: IconProps) {
  const [set, id] = registry[name];
  const data = getIconData(set, id);
  if (!data) return null;

  const { attributes, body } = iconToSVG(data);
  // Brand marks are drawn in their own colours; render them monochrome to sit on the dark theme.
  const markup = set === logos ? body.replace(/fill="(?!none)[^"]*"/g, 'fill="currentColor"') : body;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={attributes.viewBox}
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      className={className}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
