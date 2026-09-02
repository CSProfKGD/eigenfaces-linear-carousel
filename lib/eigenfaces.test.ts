import { describe, expect, it } from 'vitest';

import { reconstructFace } from './eigenfaces';

describe('reconstructFace', () => {
  it('returns the full baseline when exposed weights are untouched', () => {
    const baseline = new Float32Array([0.2, 0.4, 0.6]);
    const result = reconstructFace(
      baseline,
      [new Float32Array([1, 0, -1])],
      [2.5],
      [2.5],
    );

    expect(Array.from(result)).toEqual(Array.from(baseline));
    expect(result).not.toBe(baseline);
  });

  it('applies only the delta from each exposed component', () => {
    const result = reconstructFace(
      new Float32Array([0.2, 0.4, 0.6]),
      [new Float32Array([1, 0, -1]), new Float32Array([0.5, 1, 0.5])],
      [3, -1],
      [2.5, -1],
    );

    expect(Array.from(result)).toEqual([
      expect.closeTo(0.7, 6),
      expect.closeTo(0.4, 6),
      expect.closeTo(0.1, 6),
    ]);
  });

  it('rejects mismatched component data', () => {
    expect(() =>
      reconstructFace(
        new Float32Array([0, 0]),
        [new Float32Array([1])],
        [1],
        [0],
      ),
    ).toThrow('Every component must match the baseline length.');
  });

  it('applies exposed deltas only when their components are in the selected prefix', () => {
    const result = reconstructFace(
      new Float32Array([0.2, 0.4]),
      [new Float32Array([1, 0]), new Float32Array([0, 1])],
      [2, 4],
      [1, 1],
      1,
    );

    expect(Array.from(result)).toEqual([
      expect.closeTo(1.2, 6),
      expect.closeTo(0.4, 6),
    ]);
  });

  it('handles 24 exposed controls while preserving adjustments above the selected prefix', () => {
    const baseline = new Float32Array([0.25, 0.75]);
    const vectors = Array.from(
      { length: 24 },
      (_, index) => new Float32Array(index % 2 === 0 ? [1, 0] : [0, 1]),
    );
    const baselineWeights = Array.from({ length: 24 }, () => 0);
    const adjustedWeights = baselineWeights.map(
      (value, index) => value + index + 1,
    );

    const prefixOne = reconstructFace(
      baseline,
      vectors,
      adjustedWeights,
      baselineWeights,
      1,
    );
    const prefixTwentyFour = reconstructFace(
      baseline,
      vectors,
      adjustedWeights,
      baselineWeights,
      24,
    );
    const reset = reconstructFace(
      baseline,
      vectors,
      baselineWeights,
      baselineWeights,
      24,
    );

    expect(Array.from(prefixOne)).toEqual([
      expect.closeTo(1.25, 6),
      expect.closeTo(0.75, 6),
    ]);
    expect(prefixTwentyFour[0]).toBeGreaterThan(prefixOne[0]);
    expect(prefixTwentyFour[1]).toBeGreaterThan(prefixOne[1]);
    expect(Array.from(reset)).toEqual(Array.from(baseline));
  });
});
