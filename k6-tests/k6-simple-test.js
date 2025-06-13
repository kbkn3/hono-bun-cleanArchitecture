import http from 'k6/http';
import { check } from 'k6';

// 短時間でのパフォーマンステスト
export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95%のリクエストが500ms以内
    http_req_failed: ['rate<0.1'],    // エラー率が10%未満
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // /hello エンドポイントのテスト
  const helloRes = http.get(`${BASE_URL}/hello`);
  check(helloRes, {
    'hello status is 200': (r) => r.status === 200,
  });

  // /pokemon/:id エンドポイントのテスト
  const pokemonId = Math.floor(Math.random() * 150) + 1;
  const pokemonRes = http.get(`${BASE_URL}/pokemon/${pokemonId}`);
  check(pokemonRes, {
    'pokemon status is 200': (r) => r.status === 200,
  });
}