# EnergyGrid Data Aggregator ⚡  
A Rate-Limited Telemetry Aggregation Client

EnergyGrid Data Aggregator is a backend client application built to fetch and aggregate real-time telemetry data from **500 solar inverters** while strictly complying with **legacy API constraints**.

The system is designed to handle **strict rate limits**, **batching limits**, **custom cryptographic authentication**, and **fault-tolerant retries**, demonstrating production-grade API integration and clean system design.

---

## 🚀 Features Overview

### 🔹 Device Coverage
* 500 solar inverters
* Serial numbers generated dynamically  
  `SN-000` → `SN-499`

### 🔹 Batching
* Maximum **10 devices per request**
* Devices grouped into **50 batches**
* Optimized to maximize throughput within API limits

### 🔹 Rate Limiting
* **Strictly 1 request per second**
* Custom in-memory request queue
* No external rate-limiting libraries used

### 🔹 Secure Authentication
* Every request includes a `Signature` header
* Signature format:
MD5(URL + Token + Timestamp)
* Prevents unauthorized and replayed requests

### 🔹 Reliability & Error Handling
* Graceful handling of:
* `HTTP 429 (Too Many Requests)`
* Network / connection failures
* Automatic retries with incremental backoff
* Non-retryable errors are logged safely

---

## 📁 Project Structure

energygrid-data-aggregator/
│
├── src/
│   ├── apiClient.js        # API calls, MD5 signing, retries
│   ├── rateLimiter.js     # Custom 1 req/sec queue
│   ├── aggregator.js      # Serial generation, batching, aggregation
│   └── index.js           # Application entry point
│
├── package.json
└── README.md
