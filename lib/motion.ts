export function resetEase(progress: number): number {
  const clamped = Math.min(1, Math.max(0, progress));
  return 1 - Math.pow(1 - clamped, 3);
}

export function interpolateValues(
  start: number[],
  target: number[],
  progress: number,
): number[] {
  const easedProgress = resetEase(progress);
  return start.map(
    (value, index) => value + (target[index] - value) * easedProgress,
  );
}
