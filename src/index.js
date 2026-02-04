import { RateLimiter } from "./rateLimiter.js";
import {
  generateSerialNumbers,
  createBatches,
  fetchBatch
} from "./aggregator.js";

async function main() {
  const limiter = new RateLimiter(1000); // 1 request / second
  const serials = generateSerialNumbers();
  const batches = createBatches(serials);

  const aggregated = {};

  console.log(`Fetching ${serials.length} devices...\n`);

  for (const batch of batches) {
    try {
      const res = await fetchBatch(batch, limiter);

      for (const d of res.devices) {
        aggregated[d.serialNumber] = d;
      }

      console.log(`✔ ${batch[0]} → ${batch[batch.length - 1]}`);
    } catch (err) {
      console.error("❌ Batch failed", err);
    }
  }

  console.log("\n✅ Done");
  console.log("Total devices fetched:", Object.keys(aggregated).length);
}

main();
