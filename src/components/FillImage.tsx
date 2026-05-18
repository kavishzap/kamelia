"use client";

import Image, { type ImageProps } from "next/image";

type FillImageProps = Omit<ImageProps, "fill"> & {
  fill: true;
};

/**
 * next/image `fill` inline styles can differ between SSR and hydration (e.g. left: 0 vs "0px").
 */
export function FillImage({ className, ...props }: FillImageProps) {
  return <Image fill className={className} suppressHydrationWarning {...props} />;
}
