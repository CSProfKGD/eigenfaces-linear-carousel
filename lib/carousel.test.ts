import { describe, expect, it } from 'vitest';

import {
  captionToneForLuminance,
  carouselPresentation,
  componentIsWithinPrefix,
} from './carousel';

describe('carousel presentation', () => {
  it('keeps the active snap dominant and progressively recedes neighboring slides', () => {
    const centered = carouselPresentation(0);
    const adjacent = carouselPresentation(1);
    const outer = carouselPresentation(3);

    expect(centered).toEqual({ scale: 1, opacity: 1, brightness: 1 });
    expect(adjacent.scale).toBeLessThan(centered.scale);
    expect(outer.scale).toBeLessThan(adjacent.scale);
    expect(outer.opacity).toBeLessThan(adjacent.opacity);
  });

  it('clamps distant slides to readable visual floors', () => {
    expect(carouselPresentation(25)).toEqual({
      scale: 0.58,
      opacity: 0.24,
      brightness: 0.58,
    });
  });
});

describe('caption contrast', () => {
  it('selects dark text on light imagery and light text on dark imagery', () => {
    expect(captionToneForLuminance(0.9)).toBe('dark');
    expect(captionToneForLuminance(0.1)).toBe('light');
    expect(captionToneForLuminance(0.46)).toBe('light');
  });
});

describe('component prefix eligibility', () => {
  it('includes components at or below the current reconstruction dimensions', () => {
    expect(componentIsWithinPrefix(24, 24)).toBe(true);
    expect(componentIsWithinPrefix(24, 23)).toBe(false);
  });
});
