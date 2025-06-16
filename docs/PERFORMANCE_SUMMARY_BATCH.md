# 10回バッチテスト結果サマリー

[日本語版](./PERFORMANCE_SUMMARY_BATCH.ja.md)

## Test Configuration

- **Test Type**: Simple Load Test (Docker) - 10 iterations each
- **Duration**: 30 seconds per test
- **Virtual Users**: 5 concurrent users
- **Test Date**: 2025-06-16 10:24:15
- **Environment**: Docker containers (repeated testing)

## Statistical Performance Results

### 📊 Overall Statistics (Mean ± Standard Deviation)

| Metric | Node.js Docker | Bun Docker | Difference |
|--------|---------------|------------|------------|
| **Throughput** | 251.6 ± 11.8 req/s | 225.4 ± 41.2 req/s | **-10.4%** |
| **Average Response** | 19.84 ± 1.01 ms | 23.23 ± 6.78 ms | **-17.1%** |
| **95th Percentile** | 45.08 ± 2.67 ms | 52.08 ± 16.06 ms | **-15.5%** |
| **Max Response** | Better worst-case | Better worst-case | **+58.8%** |

### 🎯 Key Statistical Insights

#### Performance Consistency Analysis

**Node.js Docker:**
- **Highly consistent performance** across all 10 runs
- **Low standard deviation** in all metrics (±11.8 req/s throughput)
- **Predictable response times** with minimal variance
- **Stable 95th percentile** performance (45.08 ± 2.67 ms)

**Bun Docker:**
- **High performance variability** across test runs
- **Large standard deviation** in throughput (±41.2 req/s)
- **Inconsistent response times** with high variance
- **Unpredictable peak performance** (52.08 ± 16.06 ms)

#### Performance Distribution Analysis

**Node.js Results Range:**
- Throughput: 222.0 - 262.6 req/s (18% range)
- Average Response: 19.0 - 22.4 ms (18% range)
- 95th Percentile: 42.7 - 52.0 ms (22% range)

**Bun Results Range:**
- Throughput: 114.8 - 254.1 req/s (121% range)
- Average Response: 19.6 - 42.9 ms (119% range)
- 95th Percentile: 42.5 - 98.7 ms (132% range)

### 📈 Detailed Test Run Analysis

#### Node.js Performance Pattern
- **Consistent high performance** across all runs
- **Minor variation** between best (262.6 req/s) and worst (222.0 req/s)
- **Stable response time distribution**
- **Reliable production-grade performance**

#### Bun Performance Pattern
- **Extreme performance variance** between runs
- **Some runs excellent** (254.1 req/s) matching Node.js
- **Some runs poor** (114.8 req/s) significantly below Node.js
- **Inconsistent Docker container performance**

### 🔍 Root Cause Analysis

#### Why Bun Shows Inconsistency in Docker

1. **Container Startup Variance**: Bun containers may have inconsistent startup times
2. **Resource Competition**: Bun might be more sensitive to Docker resource allocation
3. **Garbage Collection Patterns**: Different GC behavior in containerized environment
4. **Network Stack Differences**: Bun's networking might perform differently in Docker
5. **Container Optimization**: Node.js Docker images may be more optimized

#### Single Test vs Batch Test Discrepancy

**Previous Single Test (Bun favorable):**
- Bun: 250 req/s (excellent performance)
- Node.js: 249 req/s (consistent performance)

**Batch Testing (Node.js favorable):**
- Node.js: Consistently good performance
- Bun: Variable performance with some poor outliers

### 🎯 Production Implications

#### For Production Deployment

**Node.js Docker Advantages:**
- **Predictable performance** across deployments
- **Consistent resource utilization**
- **Reliable scaling characteristics**
- **Lower operational risk**

**Bun Docker Considerations:**
- **Potential for excellent performance** when conditions are optimal
- **Risk of performance degradation** under certain conditions
- **Requires careful monitoring** and optimization
- **May need container tuning** for consistent performance

### 📊 Statistical Significance

#### Confidence Intervals (95%)

**Node.js Throughput**: 251.6 ± 8.4 req/s (95% CI: 243.2 - 260.0)
**Bun Throughput**: 225.4 ± 29.3 req/s (95% CI: 196.1 - 254.7)

**Key Finding**: The confidence intervals overlap, but Node.js shows much tighter bounds, indicating more reliable performance.

### 🚀 Recommendations

#### For Production Use

1. **Node.js Docker**: **Recommended for production** due to consistent performance
2. **Bun Docker**: Requires additional optimization and monitoring before production use
3. **Performance Monitoring**: Essential for Bun deployments to detect performance issues
4. **Container Tuning**: Bun containers may need specific resource allocations

#### For Development

1. **Local Development**: Bun shows excellent performance in local environments
2. **CI/CD Testing**: Include performance variance testing in pipelines
3. **Container Optimization**: Investigate Bun Docker configuration improvements

### 📝 Summary

This batch testing reveals a crucial insight: **while Bun can achieve excellent performance in optimal conditions, Node.js provides more consistent and reliable performance in Docker containers.**

**Key Findings:**
- **Node.js**: Consistent, reliable, production-ready performance
- **Bun**: High potential but variable performance in Docker
- **Recommendation**: Node.js for production, Bun for development (with monitoring)

The batch testing demonstrates the importance of statistical analysis over single-point measurements for production deployment decisions.

---

*Test results saved to: `performance-results/batch-20250616_102415/`*
*Detailed statistics: `performance-results/batch-20250616_102415/batch-summary.json`*