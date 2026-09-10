export const normalizeBlogSlug = (slug: string | undefined) =>
  (slug ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .replace(/^(?:blog\/)+/i, "");

export const getBlogPath = (slug: string | undefined) =>
  `/blog/${normalizeBlogSlug(slug)}`;

export const getBlogSlugCandidates = (slug: string | undefined) => {
  const normalizedSlug = normalizeBlogSlug(slug);

  return [...new Set([
    slug?.trim(),
    normalizedSlug,
    `blog/${normalizedSlug}`,
    `/blog/${normalizedSlug}`,
  ].filter(Boolean))];
};
