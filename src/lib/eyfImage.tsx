import Image, { type ImageProps } from "next/image";

type CldImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

/**
 * Uses Next.js image optimization for remote WordPress assets.
 * When Cloudinary is wired, map public IDs here without changing layout.
 */
export function EyfImage({ src, alt, className, ...rest }: CldImageProps) {
  return <Image src={src} alt={alt} className={className} {...rest} />;
}
