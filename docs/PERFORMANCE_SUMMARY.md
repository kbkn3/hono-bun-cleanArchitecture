# Performance Test Results Summary

[日本語版](./PERFORMANCE_SUMMARY.ja.md)

## Test Configuration

- **Test Type**: Simple Load Test
- **Duration**: 30 seconds
- **Virtual Users**: 5 concurrent users
- **Test Date**: 2025-06-13 14:53:23
- **Environment**: Local development servers

## Performance Comparison: Node.js vs Bun

### 📊 Overall Results

| Metric | Node.js | Bun | Improvement |
|--------|---------|-----|-------------|
| **Total Requests** | 7,576 | 7,898 | +4.3% |
| **Total Iterations** | 3,788 | 3,949 | +4.3% |
| **Requests/Second** | 252.18 | 262.99 | +4.3% |
| **Success Rate** | 100.00% | 100.00% | No errors |

### ⏱️ Response Time Analysis (milliseconds)

| Metric | Node.js | Bun | Improvement |
|--------|---------|-----|-------------|
| **Average** | 19.77ms | 18.95ms | **4.1% faster** |
| **Median (p50)** | 27.45ms | 27.39ms | **0.2% faster** |
| **90th Percentile** | 41.53ms | 39.71ms | **4.4% faster** |
| **95th Percentile** | 45.28ms | 43.60ms | **3.7% faster** |
| **99th Percentile** | 58.53ms | 58.05ms | **0.8% faster** |
| **Maximum** | 1,313.65ms | 256.95ms | **80.4% faster** |

### 🎯 Key Performance Insights

#### Throughput Performance

- **Bun delivered 4.3% more requests** in the same timeframe
- Both systems maintained **100% success rate** with zero errors
- Consistent performance across all percentiles

#### Response Time Performance

- **Bun showed consistent improvement** across all response time metrics
- **Significantly better maximum response time** (80.4% improvement)
- **Average response time 4.1% faster** with Bun

#### Stability Analysis

- Both systems passed all performance thresholds:
  - ✅ 95% of requests < 500ms
  - ✅ Error rate < 0.1%
- **Bun showed better worst-case performance** (max response time)
- Both systems demonstrated excellent stability under load

### 📈 Performance Trends

#### Strengths of Bun

- **Lower maximum response times** indicating better handling of peak loads
- **Slightly higher throughput** with consistent performance
- **Better worst-case scenario handling**

#### Node.js Performance

- **Solid baseline performance** with predictable response times
- **Stable under load** with minimal variance in most metrics
- **Reliable performance** across all test scenarios

### 🔍 Technical Analysis

#### Test Endpoints Validated

- `GET /hello` - Basic health check endpoint
- `GET /pokemon/1` - Pokemon API integration test
- `GET /pokemon/25` - Additional API validation (Pikachu)

#### Network Performance

- **Data Transfer**: Both systems handled similar data volumes efficiently
- **Connection Stability**: No connection failures or timeouts
- **API Integration**: Pokemon API calls successful across all tests

### 📝 Summary

This performance test demonstrates that **Bun provides measurable performance improvements** over Node.js in this Hono-based clean architecture implementation:

- **4.3% higher throughput** (more requests processed)
- **4.1% faster average response time**
- **80% better worst-case performance** (maximum response time)
- **Consistent improvements** across all response time percentiles

While both runtimes performed excellently with 100% success rates, **Bun's performance characteristics make it particularly suitable for high-throughput scenarios** where response time consistency and peak performance matter.

### 🚀 Recommendations

1. **For Production**: Consider Bun for applications requiring maximum throughput
2. **For Stability**: Both runtimes provide excellent stability and reliability
3. **For Development**: Performance differences are minimal for development workloads
4. **For Scaling**: Bun's better worst-case performance may benefit high-load scenarios

---

*Test results saved to: `performance-results/node_20250613_145323.json` and `performance-results/bun_20250613_145323.json`*
