import http from 'k6/http';
import { check } from 'k6';

// スモークテスト - 基本的な動作確認
export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_duration: ['p(99)<1000'], // 99%のリクエストが1秒以内
    http_req_failed: ['rate<0.01'],    // エラー率が1%未満
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  const responses = http.batch([
    ['GET', `${BASE_URL}/hello`],
    ['GET', `${BASE_URL}/pokemon/1`],
    ['GET', `${BASE_URL}/pokemon/25`],
    ['GET', `${BASE_URL}/pokemon/150`],
  ]);

  responses.forEach((res, i) => {
    check(res, {
      [`request ${i} status is 200`]: (r) => r.status === 200,
    });
  });
}