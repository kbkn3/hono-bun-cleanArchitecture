#!/bin/bash

# K6がインストールされているか確認
if ! command -v k6 &> /dev/null; then
    echo "K6 is not installed. Please install it first:"
    echo "brew install k6"
    exit 1
fi

# テスト対象のURL
NODE_URL="http://localhost:3000"
BUN_URL="http://localhost:3001"  # Bunは別ポートで実行する想定

echo "=== Performance Test Script for Hono Application ==="
echo ""

# Node.jsサーバーが起動しているか確認
if curl -s -o /dev/null -w "%{http_code}" "$NODE_URL/hello" | grep -q "200"; then
    echo "✅ Node.js server is running on $NODE_URL"
else
    echo "❌ Node.js server is not running on $NODE_URL"
    echo "Please start it with: npm run start:node"
fi

echo ""
echo "Select test type:"
echo "1) Smoke Test (basic functionality check)"
echo "2) Load Test (normal load simulation)"
echo "3) Stress Test (high load simulation)"
echo "4) Compare Node.js vs Bun (if both are running)"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Running Smoke Test..."
        k6 run k6-smoke-test.js
        ;;
    2)
        echo "Running Load Test..."
        k6 run k6-test.js
        ;;
    3)
        echo "Running Stress Test..."
        echo "⚠️  This test will run for about 16 minutes"
        read -p "Continue? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            k6 run k6-stress-test.js
        fi
        ;;
    4)
        echo "Running comparison test..."
        echo "Testing Node.js server..."
        k6 run --out json=node-results.json -e BASE_URL=$NODE_URL k6-test.js
        
        echo ""
        echo "Testing Bun server..."
        k6 run --out json=bun-results.json -e BASE_URL=$BUN_URL k6-test.js
        
        echo ""
        echo "Results saved to node-results.json and bun-results.json"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac