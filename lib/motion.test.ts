import { describe, expect, it } from 'vitest';

import { interpolateValues, resetEase } from './motion';

describe('reset motion', () => {
  it('eases out while preserving exact endpoints', () => {
    expect(resetEase(0)).toBe(0);
    expect(resetEase(0.5)).toBeGreaterThan(0.5);
    expect(resetEase(1)).toBe(1);
  });

  it('returns the exact baseline at completion', () => {
    expect(interpolateValues([2, -3], [0.5, 1.25], 1)).toEqual([0.5, 1.25]);
  });
});
