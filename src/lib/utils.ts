import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const seo = ({
  title,
  description,
  keywords,
  image,
  url,
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
}) => {
  const tags = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: keywords },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image:type", content: "image/png" },
    { name: "twitter:image:width", content: "1200" },
    { name: "twitter:image:height", content: "630" },
    { name: "twitter:image", content: image },
    { name: "twitter:creator", content: "@insightly" },
    { name: "twitter:site", content: "@insightly" },
    { property: "og:type", content: "website" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...(url ? [{ property: "og:url", content: url }] : []),
    ...(image
      ? [
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { property: "og:image:type", content: "image/png" },
        { property: "og:site_name", content: "Insightly" },
      ]
      : []),
  ];

  return tags;
};