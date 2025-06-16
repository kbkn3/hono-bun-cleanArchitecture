#!/bin/bash

# 10回のパフォーマンステストを実行するスクリプト
# Node.jsとBunのDockerコンテナを10回ずつテストして統計的データを収集

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 設定
TEST_RUNS=10
NODE_PORT=3000
BUN_PORT=3001
RESULTS_DIR="performance-results/batch-$(date +"%Y%m%d_%H%M%S")"

echo -e "${BLUE}=== 10回パフォーマンステスト実行 ===${NC}"
echo "テスト回数: $TEST_RUNS"
echo "結果保存先: $RESULTS_DIR"
echo ""

# 結果ディレクトリを作成
mkdir -p $RESULTS_DIR

# 既存のコンテナを停止
echo -e "${YELLOW}既存のコンテナを停止中...${NC}"
docker stop $(docker ps -q --filter "name=test-") 2>/dev/null || true
docker rm $(docker ps -aq --filter "name=test-") 2>/dev/null || true

# Node.jsテストを10回実行
echo -e "${GREEN}Node.js Dockerテストを${TEST_RUNS}回実行中...${NC}"
for i in $(seq 1 $TEST_RUNS); do
    echo -e "${BLUE}Node.js テスト $i/${TEST_RUNS}${NC}"
    
    # コンテナ起動
    docker run -d -p $NODE_PORT:3000 --name test-node-$i -e NODE_TLS_REJECT_UNAUTHORIZED=0 hono-node-app > /dev/null
    sleep 3
    
    # K6テスト実行
    k6 run --out json=${RESULTS_DIR}/node-run-${i}.json -e BASE_URL=http://localhost:$NODE_PORT k6-tests/k6-simple-test.js > /dev/null 2>&1
    
    # コンテナ停止・削除
    docker stop test-node-$i > /dev/null
    docker rm test-node-$i > /dev/null
    
    echo "  完了: ${RESULTS_DIR}/node-run-${i}.json"
done

echo ""

# Bunテストを10回実行
echo -e "${GREEN}Bun Dockerテストを${TEST_RUNS}回実行中...${NC}"
for i in $(seq 1 $TEST_RUNS); do
    echo -e "${BLUE}Bun テスト $i/${TEST_RUNS}${NC}"
    
    # コンテナ起動
    docker run -d -p $BUN_PORT:3000 --name test-bun-$i -e NODE_TLS_REJECT_UNAUTHORIZED=0 hono-bun-app > /dev/null
    sleep 3
    
    # K6テスト実行
    k6 run --out json=${RESULTS_DIR}/bun-run-${i}.json -e BASE_URL=http://localhost:$BUN_PORT k6-tests/k6-simple-test.js > /dev/null 2>&1
    
    # コンテナ停止・削除
    docker stop test-bun-$i > /dev/null
    docker rm test-bun-$i > /dev/null
    
    echo "  完了: ${RESULTS_DIR}/bun-run-${i}.json"
done

echo ""
echo -e "${GREEN}すべてのテストが完了しました！${NC}"
echo "結果の分析を開始します..."

# 統計分析スクリプトを実行
node k6-tests/analyze-batch-results.js $RESULTS_DIR

echo ""
echo -e "${GREEN}テスト完了！結果は $RESULTS_DIR に保存されました。${NC}"