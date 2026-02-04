export class RateLimiter {
  constructor(intervalMs) {
    this.queue = [];
    setInterval(() => this.run(), intervalMs);
  }

  enqueue(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({ task, resolve, reject });
    });
  }

  async run() {
    if (this.queue.length === 0) return;

    const { task, resolve, reject } = this.queue.shift();
    try {
      const result = await task();
      resolve(result);
    } catch (err) {
      reject(err);
    }
  }
}
