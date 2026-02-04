import crypto from "crypto";
import http from "http";

const API_URL = "http://localhost:3000/device/real/query";
const TOKEN = "interview_token_123";
const MAX_RETRIES = 3;

function generateSignature(url, token, timestamp) {
  const raw = `${url}${token}${timestamp}`;
  return crypto.createHash("md5").update(raw).digest("hex");
}

function postRequest(payload) {
  return new Promise((resolve, reject) => {
    const timestamp = Date.now().toString();
    const signature = generateSignature(API_URL, TOKEN, timestamp);
    const data = JSON.stringify(payload);

    const req = http.request(
      API_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
          "Token": TOKEN,
          "Timestamp": timestamp,
          "Signature": signature
        }
      },
      (res) => {
        let body = "";
        res.on("data", chunk => body += chunk);
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(body));
          } else if (res.statusCode === 429) {
            reject({ retryable: true });
          } else {
            reject({ retryable: false, message: body });
          }
        });
      }
    );

    req.on("error", err =>
      reject({ retryable: true, message: err.message })
    );

    req.write(data);
    req.end();
  });
}

export async function fetchWithRetry(payload, attempt = 1) {
  try {
    return await postRequest(payload);
  } catch (err) {
    if (err.retryable && attempt <= MAX_RETRIES) {
      await new Promise(r => setTimeout(r, attempt * 1000));
      return fetchWithRetry(payload, attempt + 1);
    }
    throw err;
  }
}
