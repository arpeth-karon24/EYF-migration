/**
 * Helpers for Cloudinary URLs once `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set.
 * Keep rendering identical by preserving width/height/crop from migrated assets.
 */
export function cldPublicUrl(publicId: string, opts?: { w?: number; q?: string }) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloud) return null;
  const transforms = [`f_auto`, `c_limit`, opts?.w ? `w_${opts.w}` : null, opts?.q ? `q_${opts.q}` : "q_auto"]
    .filter(Boolean)
    .join(",");
  return `https://res.cloudinary.com/${cloud}/image/upload/${transforms}/${publicId}`;
}
