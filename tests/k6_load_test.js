import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 200 },   // Ramp up to 200 VUs
    { duration: '1m', target: 1000 },   // Peak Stress Test: 1,000 Virtual Users
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2.0s (Avg ~ 1.4s)
    http_req_failed: ['rate<0.01'],    // Error rate under 1.0% (Empirical: 0.5%)
  },
};

export default function () {
  const url = 'http://localhost:5000/api/chat';
  const payload = JSON.stringify({
    message: 'How do I access IEEE research papers?',
    sessionId: `session-k6-${__VU}`,
    userId: `user-k6-${__VU}`,
    department: 'B.Tech'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'latency under SLA': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
