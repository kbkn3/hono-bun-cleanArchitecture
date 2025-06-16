#!/usr/bin/env node

// バッチテスト結果を分析するスクリプト
// 10回のテスト結果から統計データを算出

const fs = require('fs');
const path = require('path');

function analyzeResults(resultsDir) {
    if (!fs.existsSync(resultsDir)) {
        console.error(`❌ 結果ディレクトリが見つかりません: ${resultsDir}`);
        return;
    }

    console.log(`📊 バッチテスト結果分析: ${resultsDir}`);
    console.log('='.repeat(60));

    // Node.jsとBunの結果ファイルを取得
    const nodeFiles = fs.readdirSync(resultsDir).filter(f => f.startsWith('node-run-') && f.endsWith('.json'));
    const bunFiles = fs.readdirSync(resultsDir).filter(f => f.startsWith('bun-run-') && f.endsWith('.json'));

    console.log(`\n📁 ファイル数: Node.js=${nodeFiles.length}, Bun=${bunFiles.length}`);

    if (nodeFiles.length === 0 || bunFiles.length === 0) {
        console.error('❌ テスト結果ファイルが不足しています');
        return;
    }

    // 統計データを分析
    const nodeStats = analyzeFileSet(resultsDir, nodeFiles, 'Node.js');
    const bunStats = analyzeFileSet(resultsDir, bunFiles, 'Bun');

    // 比較結果を表示
    console.log('\n📈 統計比較結果');
    console.log('='.repeat(60));
    
    const comparison = {
        throughput: calculateImprovement(nodeStats.throughput, bunStats.throughput),
        avgResponse: calculateImprovement(nodeStats.avgResponse, bunStats.avgResponse, true),
        p95Response: calculateImprovement(nodeStats.p95Response, bunStats.p95Response, true),
        maxResponse: calculateImprovement(nodeStats.maxResponse, bunStats.maxResponse, true)
    };

    console.log(`\n🚀 Bunの改善率:`);
    console.log(`   スループット: ${comparison.throughput.improvement}%`);
    console.log(`   平均応答時間: ${comparison.avgResponse.improvement}%`);
    console.log(`   95パーセンタイル: ${comparison.p95Response.improvement}%`);
    console.log(`   最大応答時間: ${comparison.maxResponse.improvement}%`);

    // 統計的有意性の簡易チェック
    console.log('\n📊 統計サマリー');
    console.log('='.repeat(60));
    console.log(`Node.js Docker (平均 ± 標準偏差):`);
    console.log(`   スループット: ${nodeStats.throughput.mean.toFixed(1)} ± ${nodeStats.throughput.stddev.toFixed(1)} req/s`);
    console.log(`   平均応答時間: ${nodeStats.avgResponse.mean.toFixed(2)} ± ${nodeStats.avgResponse.stddev.toFixed(2)} ms`);
    console.log(`   95パーセンタイル: ${nodeStats.p95Response.mean.toFixed(2)} ± ${nodeStats.p95Response.stddev.toFixed(2)} ms`);
    
    console.log(`\nBun Docker (平均 ± 標準偏差):`);
    console.log(`   スループット: ${bunStats.throughput.mean.toFixed(1)} ± ${bunStats.throughput.stddev.toFixed(1)} req/s`);
    console.log(`   平均応答時間: ${bunStats.avgResponse.mean.toFixed(2)} ± ${bunStats.avgResponse.stddev.toFixed(2)} ms`);
    console.log(`   95パーセンタイル: ${bunStats.p95Response.mean.toFixed(2)} ± ${bunStats.p95Response.stddev.toFixed(2)} ms`);

    // 結果をファイルに保存
    const summaryFile = path.join(resultsDir, 'batch-summary.json');
    const summary = {
        testDate: new Date().toISOString(),
        testRuns: nodeFiles.length,
        nodeStats,
        bunStats,
        comparison
    };
    
    fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
    console.log(`\n💾 詳細結果を保存しました: ${summaryFile}`);
}

function analyzeFileSet(resultsDir, files, runtime) {
    console.log(`\n🔍 ${runtime} 結果分析 (${files.length}回のテスト)`);
    
    const metrics = {
        throughput: [],
        avgResponse: [],
        p95Response: [],
        maxResponse: [],
        totalRequests: [],
        successRate: []
    };

    files.forEach((file, index) => {
        try {
            const filePath = path.join(resultsDir, file);
            const data = fs.readFileSync(filePath, 'utf8');
            const lines = data.trim().split('\n');
            
            let testData = {};
            
            lines.forEach(line => {
                try {
                    const record = JSON.parse(line);
                    if (record.type === 'Point' && record.metric === 'http_reqs' && record.data.tags.expected_response === 'true') {
                        if (!testData.totalRequests) testData.totalRequests = 0;
                        testData.totalRequests += record.data.value;
                    }
                    if (record.type === 'Point' && record.metric === 'http_req_duration' && record.data.tags.expected_response === 'true') {
                        if (!testData.responseTimes) testData.responseTimes = [];
                        testData.responseTimes.push(record.data.value);
                    }
                } catch (e) {
                    // JSONパースエラーは無視
                }
            });

            if (testData.totalRequests && testData.responseTimes) {
                // スループットを計算（30秒テストなので）
                const throughput = testData.totalRequests / 30;
                metrics.throughput.push(throughput);
                
                // 応答時間統計
                const sorted = testData.responseTimes.sort((a, b) => a - b);
                const avgResponse = sorted.reduce((a, b) => a + b, 0) / sorted.length;
                const p95Index = Math.floor(sorted.length * 0.95);
                const p95Response = sorted[p95Index] || sorted[sorted.length - 1];
                const maxResponse = Math.max(...sorted);
                
                metrics.avgResponse.push(avgResponse);
                metrics.p95Response.push(p95Response);
                metrics.maxResponse.push(maxResponse);
                metrics.totalRequests.push(testData.totalRequests);
                metrics.successRate.push(100); // エラーがある場合は別途処理が必要
                
                console.log(`   テスト${index + 1}: ${throughput.toFixed(1)} req/s, 平均${avgResponse.toFixed(1)}ms, p95=${p95Response.toFixed(1)}ms`);
            }
        } catch (error) {
            console.warn(`⚠️  ファイル処理エラー ${file}: ${error.message}`);
        }
    });

    // 統計計算
    const stats = {};
    Object.keys(metrics).forEach(key => {
        if (metrics[key].length > 0) {
            const values = metrics[key];
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
            const stddev = Math.sqrt(variance);
            const min = Math.min(...values);
            const max = Math.max(...values);
            
            stats[key] = { mean, stddev, min, max, values };
        }
    });

    return stats;
}

function calculateImprovement(baseline, comparison, isLowerBetter = false) {
    const baseValue = baseline.mean;
    const compValue = comparison.mean;
    
    let improvement;
    if (isLowerBetter) {
        improvement = ((baseValue - compValue) / baseValue * 100);
    } else {
        improvement = ((compValue - baseValue) / baseValue * 100);
    }
    
    return {
        baseline: baseValue,
        comparison: compValue,
        improvement: improvement.toFixed(1),
        direction: improvement > 0 ? 'better' : 'worse'
    };
}

// メイン実行
if (require.main === module) {
    const resultsDir = process.argv[2];
    if (!resultsDir) {
        console.error('使用方法: node analyze-batch-results.js <results-directory>');
        process.exit(1);
    }
    analyzeResults(resultsDir);
}

module.exports = { analyzeResults };