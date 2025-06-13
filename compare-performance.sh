#!/bin/bash

# パフォーマンステスト比較スクリプト
# Node.jsとBunの両方でサーバーを起動し、K6でテストして結果を比較します

# カラー定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ポート設定
NODE_PORT=3000
BUN_PORT=3001

# 結果ファイル
NODE_RESULTS="node-results.json"
BUN_RESULTS="bun-results.json"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
RESULTS_DIR="performance-results"

# 結果ディレクトリを作成
mkdir -p $RESULTS_DIR

echo -e "${BLUE}=== Hono Application Performance Comparison ===${NC}"
echo ""

# K6がインストールされているか確認
if ! command -v k6 &> /dev/null; then
    echo -e "${RED}K6 is not installed. Please install it first:${NC}"
    echo "brew install k6"
    exit 1
fi

# 既存のサーバーを停止
echo -e "${YELLOW}Stopping any existing servers...${NC}"
pkill -f "node.*dist/index.node.js" 2>/dev/null || true
pkill -f "tsx.*index.node.ts" 2>/dev/null || true
pkill -f "bun.*src/index.ts" 2>/dev/null || true
docker stop $(docker ps -q --filter "ancestor=hono-bun-app") 2>/dev/null || true
docker stop $(docker ps -q --filter "ancestor=hono-bun-app-bun") 2>/dev/null || true
sleep 2

# テストタイプを選択
echo "Select test scenario:"
echo "1) Local servers (Node.js with tsx + Bun)"
echo "2) Docker containers (Node.js + Bun)"
echo "3) Production build (Node.js compiled + Bun)"
read -p "Enter your choice (1-3): " test_type

# サーバー起動関数
start_local_servers() {
    echo -e "${GREEN}Starting Node.js server on port $NODE_PORT...${NC}"
    PORT=$NODE_PORT NODE_TLS_REJECT_UNAUTHORIZED=0 npm run start:node > /dev/null 2>&1 &
    NODE_PID=$!
    
    echo -e "${GREEN}Starting Bun server on port $BUN_PORT...${NC}"
    PORT=$BUN_PORT NODE_TLS_REJECT_UNAUTHORIZED=0 bun run src/index.ts > /dev/null 2>&1 &
    BUN_PID=$!
    
    echo "Waiting for servers to start..."
    sleep 5
    
    # サーバーが起動しているか確認
    if ! curl -s -o /dev/null -w "%{http_code}" "http://localhost:$NODE_PORT/hello" | grep -q "200"; then
        echo -e "${RED}Node.js server failed to start${NC}"
        cleanup_local
        exit 1
    fi
    
    if ! curl -s -o /dev/null -w "%{http_code}" "http://localhost:$BUN_PORT/hello" | grep -q "200"; then
        echo -e "${RED}Bun server failed to start${NC}"
        cleanup_local
        exit 1
    fi
}

start_docker_servers() {
    echo -e "${GREEN}Building and starting Docker containers...${NC}"
    
    # Node.js Docker
    docker build -t hono-node-app . > /dev/null 2>&1
    docker run -d -p $NODE_PORT:3000 --name node-perf-test -e NODE_TLS_REJECT_UNAUTHORIZED=0 hono-node-app > /dev/null
    
    # Bun Docker
    docker build -t hono-bun-app -f Dockerfile.bun . > /dev/null 2>&1
    docker run -d -p $BUN_PORT:3000 --name bun-perf-test -e NODE_TLS_REJECT_UNAUTHORIZED=0 hono-bun-app > /dev/null
    
    echo "Waiting for containers to start..."
    sleep 10
}

start_production_servers() {
    echo -e "${GREEN}Building production version...${NC}"
    npm run build:node > /dev/null 2>&1
    
    echo -e "${GREEN}Starting Node.js production server on port $NODE_PORT...${NC}"
    PORT=$NODE_PORT NODE_TLS_REJECT_UNAUTHORIZED=0 node dist/index.node.js > /dev/null 2>&1 &
    NODE_PID=$!
    
    echo -e "${GREEN}Starting Bun server on port $BUN_PORT...${NC}"
    PORT=$BUN_PORT NODE_TLS_REJECT_UNAUTHORIZED=0 bun run src/index.ts > /dev/null 2>&1 &
    BUN_PID=$!
    
    echo "Waiting for servers to start..."
    sleep 5
}

# クリーンアップ関数
cleanup_local() {
    echo -e "${YELLOW}Cleaning up...${NC}"
    [ ! -z "$NODE_PID" ] && kill $NODE_PID 2>/dev/null
    [ ! -z "$BUN_PID" ] && kill $BUN_PID 2>/dev/null
}

cleanup_docker() {
    echo -e "${YELLOW}Cleaning up Docker containers...${NC}"
    docker stop node-perf-test 2>/dev/null && docker rm node-perf-test 2>/dev/null
    docker stop bun-perf-test 2>/dev/null && docker rm bun-perf-test 2>/dev/null
}

# サーバーを起動
case $test_type in
    1)
        start_local_servers
        trap cleanup_local EXIT
        ;;
    2)
        start_docker_servers
        trap cleanup_docker EXIT
        ;;
    3)
        start_production_servers
        trap cleanup_local EXIT
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# K6テストを選択
echo ""
echo "Select K6 test:"
echo "1) Smoke Test (10 seconds, 1 VU)"
echo "2) Simple Load Test (30 seconds, 5 VUs)"
echo "3) Standard Load Test (2 minutes, gradual to 10 VUs)"
echo "4) Stress Test (16 minutes, up to 200 VUs)"
read -p "Enter your choice (1-4): " k6_test

case $k6_test in
    1) K6_SCRIPT="k6-tests/k6-smoke-test.js" ;;
    2) K6_SCRIPT="k6-tests/k6-simple-test.js" ;;
    3) K6_SCRIPT="k6-tests/k6-test.js" ;;
    4) K6_SCRIPT="k6-tests/k6-stress-test.js" ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

# Node.jsテスト実行
echo ""
echo -e "${BLUE}Running K6 test on Node.js server...${NC}"
k6 run --out json=$NODE_RESULTS -e BASE_URL=http://localhost:$NODE_PORT $K6_SCRIPT

# Bunテスト実行（Dockerの場合はスキップ）
if [ "$test_type" != "2" ]; then
    echo ""
    echo -e "${BLUE}Running K6 test on Bun server...${NC}"
    k6 run --out json=$BUN_RESULTS -e BASE_URL=http://localhost:$BUN_PORT $K6_SCRIPT
fi

# 結果を保存
echo ""
echo -e "${GREEN}Saving results...${NC}"
mv $NODE_RESULTS "$RESULTS_DIR/node_${TIMESTAMP}.json"
[ -f $BUN_RESULTS ] && mv $BUN_RESULTS "$RESULTS_DIR/bun_${TIMESTAMP}.json"

# 結果を表示
echo ""
echo -e "${BLUE}=== Performance Comparison Results ===${NC}"
echo ""
echo -e "${YELLOW}Node.js Results:${NC}"
node k6-tests/analyze-k6-results.js "$RESULTS_DIR/node_${TIMESTAMP}.json"

if [ -f "$RESULTS_DIR/bun_${TIMESTAMP}.json" ]; then
    echo ""
    echo -e "${YELLOW}Bun Results:${NC}"
    node k6-tests/analyze-k6-results.js "$RESULTS_DIR/bun_${TIMESTAMP}.json"
fi

echo ""
echo -e "${GREEN}Results saved to $RESULTS_DIR/${NC}"
echo -e "${GREEN}Test completed successfully!${NC}"