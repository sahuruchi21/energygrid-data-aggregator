import { fetchWithRetry } from "./apiClient.js";

export function generateSerialNumbers() {
  return Array.from({ length: 500 }, (_, i) =>
    `SN-${String(i).padStart(3, "0")}`
  );
}

export function createBatches(serials, size = 10) {
  const batches = [];
  for (let i = 0; i < serials.length; i += size) {
    batches.push(serials.slice(i, i + size));
  }
  return batches;
}

export async function fetchBatch(batch, limiter) {
  return limiter.enqueue(() =>
    fetchWithRetry({ serialNumbers: batch })
  );
}
