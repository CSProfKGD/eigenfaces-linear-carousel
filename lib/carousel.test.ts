import { describe, expect, it } from 'vitest';

import {
  autoplayShouldRun,
  carouselPresentation,
  carouselSlideLabel,
  componentIsWithinPrefix,
} from './carousel';

describe('carousel presentation', () => {
  it('keeps the active snap dominant and progressively recedes neighboring slides', () => {
    const centered = carouselPresentation(0, 25);
    const adjacent = carouselPresentation(1 / 25, 25);
    const outer = carouselPresentation(3 / 25, 25);

    expect(centered).toEqual({ scale: 1, opacity: 1, brightness: 1 });
    expect(adjacent.scale).toBeLessThan(centered.scale);
    expect(outer.scale).toBeLessThan(adjacent.scale);
    expect(outer.opacity).toBeLessThan(adjacent.opacity);
  });

  it('clamps distant slides to readable visual floors', () => {
    expect(carouselPresentation(1, 25)).toEqual({
      scale: 0.58,
      opacity: 0.24,
      brightness: 0.58,
    });
  });

  it('labels the mean and component snaps consistently', () => {
    expect(carouselSlideLabel(0)).toBe('Mean');
    expect(carouselSlideLabel(1)).toBe('PC 01');
    expect(carouselSlideLabel(24)).toBe('PC 24');
  });
});

describe('component prefix eligibility', () => {
  it('includes components at or below the current reconstruction dimensions', () => {
    expect(componentIsWithinPrefix(24, 24)).toBe(true);
    expect(componentIsWithinPrefix(24, 23)).toBe(false);
  });
});

describe('carousel autoplay policy', () => {
  it('runs only when enabled, motion is allowed, and no interaction is active', () => {
    expect(
      autoplayShouldRun({
        enabled: true,
        reducedMotion: false,
        interactionActive: false,
      }),
    ).toBe(true);
    expect(
      autoplayShouldRun({
        enabled: true,
        reducedMotion: true,
        interactionActive: false,
      }),
    ).toBe(false);
    expect(
      autoplayShouldRun({
        enabled: true,
        reducedMotion: false,
        interactionActive: true,
      }),
    ).toBe(false);
    expect(
      autoplayShouldRun({
        enabled: false,
        reducedMotion: false,
        interactionActive: false,
      }),
    ).toBe(false);
  });
});
