type Metrics = Record<string, number>;

const metrics: Metrics = Object.create(null);

export function incMetric(name: string, by = 1) {
  metrics[name] = (metrics[name] || 0) + by;
}

export function snapshotMetrics() {
  return { ...metrics };
}

export function resetMetrics() {
  for (const k of Object.keys(metrics)) delete metrics[k];
}
