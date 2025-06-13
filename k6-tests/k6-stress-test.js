import http from 'k6/http';
import { check } from 'k6';

// ストレステスト - 高負荷での性能測定
export const options = {
  stages: [
    { duration: '2m', target: 100 },   // 2分で100ユーザーまで増加
    { duration: '5m', target: 100 },   // 5分間100ユーザーを維持
    { duration: '2m', target: 200 },   // 2分で200ユーザーまで増加
    { duration: '5m', target: 200 },   // 5分間200ユーザーを維持
    { duration: '2m', target: 0 },     // 2分で0ユーザーまで減少
  ],
  thresholds: {
    http_req_duration: ['p(90)<1000', 'p(95)<2000'], // 90%が1秒以内、95%が2秒以内
    http_req_failed: ['rate<0.1'],                    // エラー率が10%未満
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const pokemonId = Math.floor(Math.random() * 898) + 1; // 1-898のランダムなポケモンID
  const res = http.get(`${BASE_URL}/pokemon/${pokemonId}`);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });
}