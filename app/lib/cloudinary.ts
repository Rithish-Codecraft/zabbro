/**
 * Helper to construct optimized image URLs using Cloudinary dynamic transformations
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    crop?: "fill" | "thumb" | "fit" | "scale";
    quality?: "auto" | "best" | "good" | "eco";
    format?: "auto" | "webp" | "avif";
  }
): string {
  if (!url) return "";

  // Check if it's a Cloudinary URL
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    const transformations: string[] = [];

    const format = options?.format || "auto";
    const quality = options?.quality ? `auto:${options.quality}` : "auto";
    transformations.push(`f_${format}`, `q_${quality}`);

    if (options?.width) transformations.push(`w_${options.width}`);
    if (options?.height) transformations.push(`h_${options.height}`);
    if (options?.crop) transformations.push(`c_${options.crop}`);

    const transformStr = transformations.join(",");
    return url.replace("/upload/", `/upload/${transformStr}/`);
  }

  // Fallback for Unsplash URLs
  if (url.includes("images.unsplash.com")) {
    const u = new URL(url);
    if (options?.width) u.searchParams.set("w", String(options.width));
    if (options?.height) u.searchParams.set("h", String(options.height));
    u.searchParams.set("auto", "format");
    u.searchParams.set("q", "80");
    return u.toString();
  }

  return url;
}
