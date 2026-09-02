import { createElement, forwardRef, type ImgHTMLAttributes } from 'react';

type PortableImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  priority?: boolean;
  unoptimized?: boolean;
};

const PortableImage = forwardRef<HTMLImageElement, PortableImageProps>(
  ({ priority: _priority, unoptimized: _unoptimized, ...props }, ref) =>
    createElement('img', { ...props, ref }),
);

PortableImage.displayName = 'PortableImage';

export default PortableImage;
