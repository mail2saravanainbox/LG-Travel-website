/**
 * Cloudinary delivery helpers.
 *
 * Set `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` to enable. When unset (or when given a
 * full http(s) URL), helpers pass the source through untouched — so existing
 * Unsplash/Pexels URLs keep working until assets are migrated to Cloudinary.
 */
export const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const isAbsolute = (s: string) => /^https?:\/\//.test(s);

export interface CldOptions {
  /** target width in px */
  w?: number;
  /** target height in px */
  h?: number;
  /** quality, e.g. "auto" (default) or 80 */
  q?: string | number;
  /** crop mode, e.g. "fill", "fit", "thumb" */
  crop?: string;
}

/** Build a transformed Cloudinary delivery URL from a public ID. */
export function cld(publicId: string, opts: CldOptions = {}): string {
  if (!CLOUD_NAME || isAbsolute(publicId)) return publicId;
  const t = ["f_auto", `q_${opts.q ?? "auto"}`];
  if (opts.w) t.push(`w_${opts.w}`);
  if (opts.h) t.push(`h_${opts.h}`);
  if (opts.crop) t.push(`c_${opts.crop}`);
  const id = publicId.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${t.join(",")}/${id}`;
}

/**
 * `next/image` custom loader. Pass to a specific <Image loader={cloudinaryLoader} />
 * whose `src` is a Cloudinary public ID. Absolute URLs are returned as-is.
 */
export function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!CLOUD_NAME || isAbsolute(src)) return src;
  const id = src.replace(/^\/+/, "");
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_${quality ?? "auto"},w_${width}/${id}`;
}
