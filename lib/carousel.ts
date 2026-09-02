export type CarouselPresentation = {
  scale: number;
  opacity: number;
  brightness: number;
};

export function carouselPresentation(
  stepsFromCenter: number,
): CarouselPresentation {
  const stepsAway = Math.abs(stepsFromCenter);
  return {
    scale: Math.max(0.58, 1 - stepsAway * 0.17),
    opacity: Math.max(0.24, 1 - stepsAway * 0.16),
    brightness: Math.max(0.58, 1 - stepsAway * 0.09),
  };
}

export function carouselSlideLabel(slideIndex: number): string {
  return slideIndex === 0
    ? 'Mean'
    : `PC ${String(slideIndex).padStart(2, '0')}`;
}

export function componentIsWithinPrefix(
  componentIndex: number,
  dimensions: number,
): boolean {
  return componentIndex <= dimensions;
}
