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

```
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
```

---

## 🔐 Authentication System

### Request Headers
* `Token`
* `Timestamp`
* `Signature`
* `Content-Type: application/json`

### Signature Logic
* Signature is generated **per request**
* Timestamp-based signing ensures request freshness
* Validated server-side by the EnergyGrid API

---

## ⏱️ Rate Limiting Architecture

### Why Custom Rate Limiting?
* External libraries intentionally avoided
* Full control over execution timing
* Deterministic and predictable behavior

### Execution Flow
Request Queue
↓
1 request dequeued every second
↓
Signed API request
↓
Retry on failure (if applicable)

---

## 🔄 Data Flow (Clear Mental Model)

500 Devices
↓
Batching (10 devices / request)
↓
Rate-Limited Queue (1 req/sec)
↓
Signed API Requests
↓
Retry Logic (429 / Network)
↓
Unified Aggregated Result


---

## ⚙️ How to Run

### 1️⃣ Start the Mock API Server
```bash
cd mock-api
npm install
npm start
Expected output:
Mock API running on http://localhost:3000
```
2️⃣ Run the Aggregator Client
```bash
cd energygrid-data-aggregator
npm start
✅ Expected Output
Fetching 500 devices...

✔ SN-000 → SN-009
✔ SN-010 → SN-019
✔ SN-020 → SN-029
...
✔ SN-490 → SN-499

Total devices fetched: 500
```
## 🧠 Design Philosophy

Correctness over raw concurrency

Explicit rate control instead of timing hacks

Clear separation of concerns

Minimal dependencies for transparency

Production-style defensive programming

## 🧩 What This Project Demonstrates

Real-world API integration under strict constraints

Rate-limit-aware system design

Secure request signing

Fault-tolerant retry mechanisms

Clean, modular Node.js architecture

## By
Ruchi Sahu
