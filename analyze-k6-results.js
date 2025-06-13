#!/usr/bin/env node

const fs = require('fs');

function analyzeResults(filename) {
  console.log(`\n📊 Analyzing ${filename}...\n`);
  
  // JSONLファイルを読み込む
  const data = fs.readFileSync(filename, 'utf8')
    .split('\n')
    .filter(line => line.trim())
    .map(line => JSON.parse(line));

  // メトリクスを収集
  const httpReqDurations = data
    .filter(item => item.type === 'Point' && item.metric === 'http_req_duration')
    .map(item => item.data.value);

  const httpReqs = data
    .filter(item => item.type === 'Point' && item.metric === 'http_reqs')
    .length;

  const checks = data
    .filter(item => item.type === 'Point' && item.metric === 'checks')
    .map(item => item.data.value);

  const iterations = data
    .filter(item => item.type === 'Point' && item.metric === 'iteration_duration')
    .length;

  // 統計を計算
  httpReqDurations.sort((a, b) => a - b);
  const avg = httpReqDurations.reduce((sum, val) => sum + val, 0) / httpReqDurations.length;
  const p50 = httpReqDurations[Math.floor(httpReqDurations.length * 0.50)];
  const p90 = httpReqDurations[Math.floor(httpReqDurations.length * 0.90)];
  const p95 = httpReqDurations[Math.floor(httpReqDurations.length * 0.95)];
  const p99 = httpReqDurations[Math.floor(httpReqDurations.length * 0.99)];
  const min = httpReqDurations[0];
  const max = httpReqDurations[httpReqDurations.length - 1];

  const checksPassed = checks.filter(v => v === 1).length;
  const checksFailed = checks.filter(v => v === 0).length;
  const successRate = (checksPassed / checks.length * 100).toFixed(2);

  // 結果を表示
  console.log('📈 Performance Metrics:');
  console.log(`  Total Requests: ${httpReqs}`);
  console.log(`  Total Iterations: ${iterations}`);
  console.log(`  Success Rate: ${successRate}%`);
  console.log('');
  console.log('⏱️  Response Time (ms):');
  console.log(`  Min: ${min.toFixed(2)}`);
  console.log(`  Avg: ${avg.toFixed(2)}`);
  console.log(`  Median (p50): ${p50.toFixed(2)}`);
  console.log(`  p90: ${p90.toFixed(2)}`);
  console.log(`  p95: ${p95.toFixed(2)}`);
  console.log(`  p99: ${p99.toFixed(2)}`);
  console.log(`  Max: ${max.toFixed(2)}`);
  console.log('');
  console.log('✅ Checks:');
  console.log(`  Passed: ${checksPassed}`);
  console.log(`  Failed: ${checksFailed}`);
}

// コマンドライン引数からファイル名を取得
const filename = process.argv[2] || 'node-results.json';

if (!fs.existsSync(filename)) {
  console.error(`File ${filename} not found`);
  process.exit(1);
}

analyzeResults(filename);