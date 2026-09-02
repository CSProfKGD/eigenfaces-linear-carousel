import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';

import { describe, expect, it } from 'vitest';

type Manifest = {
  defaultDimensions: number;
  maxDimensions: number;
  width: number;
  height: number;
  cumulativeExplainedVariance: number[];
  components: Array<{
    index: number;
    eigenvalue: number;
    explainedVariance: number;
    baselineWeight: number;
    baselineZ: number;
    vector: string;
    vectorSha256: string;
    thumbnail: string;
  }>;
};

const manifest = JSON.parse(
  readFileSync(resolve('public/eigenfaces/manifest.json'), 'utf8'),
) as Manifest;

describe('dimension-prefix assets', () => {
  it('defaults to 512 dimensions and includes all 1000 cached prefixes', () => {
    expect(manifest.defaultDimensions).toBe(512);
    expect(manifest.maxDimensions).toBe(1000);
    expect(manifest.cumulativeExplainedVariance).toHaveLength(1000);
    expect(
      gunzipSync(
        readFileSync(
          resolve('public/eigenfaces/prefix-reconstructions.delta.bin'),
        ),
      ).length,
    ).toBe(1000 * manifest.width * manifest.height);
  });

  it('uses the actual monotonically increasing cumulative variance curve', () => {
    for (
      let index = 1;
      index < manifest.cumulativeExplainedVariance.length;
      index += 1
    ) {
      expect(
        manifest.cumulativeExplainedVariance[index],
      ).toBeGreaterThanOrEqual(manifest.cumulativeExplainedVariance[index - 1]);
    }
    expect(manifest.cumulativeExplainedVariance[511]).toBeCloseTo(0.9512, 4);
    expect(manifest.cumulativeExplainedVariance[999]).toBeGreaterThan(
      manifest.cumulativeExplainedVariance[511],
    );
  });

  it('exports 24 ordered, finite, checksum-verified component records', () => {
    expect(manifest.components).toHaveLength(24);
    const totalVariance =
      manifest.components[0].eigenvalue /
      manifest.components[0].explainedVariance;

    manifest.components.forEach((component, index) => {
      expect(component.index).toBe(index + 1);
      const previous =
        index === 0 ? 0 : manifest.cumulativeExplainedVariance[index - 1];
      expect(component.explainedVariance).toBeCloseTo(
        manifest.cumulativeExplainedVariance[index] - previous,
        10,
      );
      expect(component.eigenvalue / component.explainedVariance).toBeCloseTo(
        totalVariance,
        5,
      );
      expect(component.baselineZ).toBeCloseTo(
        component.baselineWeight / Math.sqrt(component.eigenvalue),
        6,
      );

      const vectorPath = resolve('public', component.vector.replace(/^\//, ''));
      const vector = readFileSync(vectorPath);
      expect(vector.length).toBe(manifest.width * manifest.height * 4);
      expect(createHash('sha256').update(vector).digest('hex')).toBe(
        component.vectorSha256,
      );
      for (let offset = 0; offset < vector.length; offset += 4) {
        expect(Number.isFinite(vector.readFloatLE(offset))).toBe(true);
      }

      const thumbnail = readFileSync(
        resolve('public', component.thumbnail.replace(/^\//, '')),
      );
      expect(thumbnail.subarray(1, 4).toString()).toBe('PNG');
      expect(thumbnail.readUInt32BE(16)).toBe(manifest.width);
      expect(thumbnail.readUInt32BE(20)).toBe(manifest.height);
    });
  });
});
