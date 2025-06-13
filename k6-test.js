import http from 'k6/http';
import { check, sleep } from 'k6';

// テストの設定
export const options = {
  stages: [
    { duration: '30s', target: 10 },  // 30秒で10ユーザーまで増加
    { duration: '1m', target: 10 },   // 1分間10ユーザーを維持
    { duration: '30s', target: 0 },   // 30秒で0ユーザーまで減少
  ],
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
    'hello response has message': (r) => r.json('message') === 'hello',
  });

  sleep(1);

  // /pokemon/:id エンドポイントのテスト
  const pokemonId = Math.floor(Math.random() * 150) + 1; // 1-150のランダムなポケモンID
  const pokemonRes = http.get(`${BASE_URL}/pokemon/${pokemonId}`);
  check(pokemonRes, {
    'pokemon status is 200': (r) => r.status === 200,
    'pokemon response has id': (r) => r.json('result.id') === pokemonId,
    'pokemon response has name': (r) => r.json('result.name') !== null,
  });

  sleep(1);
}