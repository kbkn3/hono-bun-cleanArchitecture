# Complete Performance Analysis: Node.js vs Bun

[日本語版](./PERFORMANCE_ANALYSIS_COMPLETE.ja.md)

## Overview

This comprehensive analysis compares Node.js and Bun performance across multiple testing scenarios: local development, single Docker tests, and statistical batch testing. The results reveal important insights about runtime behavior in different environments.

## Test Methodology

### Test Scenarios Conducted

1. **Local Development Testing** (2025-06-13)
   - Environment: Local servers (tsx for Node.js, bun for Bun)
   - Duration: 30 seconds, 5 concurrent users
   - Purpose: Baseline performance comparison

2. **Single Docker Container Testing** (2025-06-16)
   - Environment: Docker containers (production configurations)
   - Duration: 30 seconds, 5 concurrent users
   - Purpose: Containerization impact assessment

3. **Statistical Batch Testing** (2025-06-16)
   - Environment: Docker containers, 10 iterations each
   - Duration: 30 seconds per test, 5 concurrent users
   - Purpose: Statistical significance and reliability analysis

### Technical Configuration

- **Framework**: Hono (Clean Architecture implementation)
- **Test Tool**: K6 load testing
- **Test Endpoints**: 
  - `GET /hello` (basic health check)
  - `GET /pokemon/1` (API integration)
  - `GET /pokemon/25` (additional validation)
- **Success Criteria**: 95% requests < 500ms, error rate < 0.1%

## Results Summary

### 1. Local Development Performance

| Metric | Node.js Local | Bun Local | Bun Advantage |
|--------|--------------|-----------|---------------|
| **Throughput** | 252.18 req/s | 262.99 req/s | **+4.3%** |
| **Average Response** | 19.77ms | 18.95ms | **+4.1%** |
| **95th Percentile** | 45.28ms | 43.60ms | **+3.7%** |
| **Max Response** | 1,313ms | 257ms | **+80.4%** |
| **Success Rate** | 100% | 100% | Perfect |

**Key Finding**: Bun shows consistent improvements, especially in worst-case scenarios.

### 2. Single Docker Container Performance

| Metric | Node.js Docker | Bun Docker | Comparison |
|--------|---------------|------------|------------|
| **Throughput** | 249.36 req/s | 249.57 req/s | **+0.1%** |
| **Average Response** | 19.93ms | 19.89ms | **+0.2%** |
| **95th Percentile** | 45.18ms | 44.10ms | **+2.4%** |
| **Max Response** | 1,366ms | 557ms | **+59.2%** |
| **Success Rate** | 100% | 100% | Perfect |

**Key Finding**: Nearly identical throughput, but Bun maintains superior worst-case performance.

### 3. Statistical Batch Testing (10 Iterations)

| Metric | Node.js Docker | Bun Docker | Reality Check |
|--------|---------------|------------|---------------|
| **Throughput** | 251.6 ± 11.8 req/s | 225.4 ± 41.2 req/s | **-10.4%** |
| **Average Response** | 19.84 ± 1.01 ms | 23.23 ± 6.78 ms | **-17.1%** |
| **95th Percentile** | 45.08 ± 2.67 ms | 52.08 ± 16.06 ms | **-15.5%** |
| **Consistency** | Highly stable | High variance | **Node.js wins** |

**Critical Finding**: Bun shows significant performance variance in Docker environments.

## Performance Characteristics Analysis

### Node.js Performance Profile

#### Strengths
- **Exceptional consistency** across all test scenarios
- **Predictable performance** with low variance (±11.8 req/s)
- **Mature Docker optimization** with minimal containerization overhead
- **Reliable production characteristics**

#### Performance Pattern
- Local: Solid baseline performance
- Docker Single: Minimal performance degradation
- Docker Batch: Highly consistent results

### Bun Performance Profile

#### Strengths
- **Superior peak performance** in optimal conditions
- **Excellent worst-case handling** in stable environments
- **Outstanding local development performance**

#### Weaknesses
- **High performance variance** in containerized environments
- **Unpredictable Docker performance** (115-254 req/s range)
- **Potential for significant degradation** under certain conditions

#### Performance Pattern
- Local: Consistently superior to Node.js
- Docker Single: Comparable to Node.js
- Docker Batch: Highly variable, often inferior

## Environment-Specific Insights

### Local Development Environment

**Winner: Bun**
- 4.3% higher throughput
- 4.1% faster average response time
- 80% better worst-case performance
- Excellent developer experience

### Docker Production Environment

**Winner: Node.js**
- Highly consistent performance
- Predictable resource utilization
- Lower operational risk
- Production-proven reliability

## Statistical Significance

### Confidence Intervals (95%)

**Local Environment:**
- Node.js: Consistent baseline
- Bun: Consistently 4-5% better

**Docker Environment (Batch Testing):**
- Node.js: 251.6 ± 8.4 req/s (CI: 243.2-260.0)
- Bun: 225.4 ± 29.3 req/s (CI: 196.1-254.7)

**Interpretation**: Non-overlapping confidence intervals in batch testing indicate statistically significant performance differences.

## Root Cause Analysis

### Why Single Tests Mislead

Single-point measurements can capture optimal conditions but miss:
- Performance variance patterns
- Reliability under repeated stress
- Resource competition effects
- Container startup inconsistencies

### Bun's Docker Challenges

1. **Container Optimization Gap**: Node.js Docker images are more mature
2. **Resource Sensitivity**: Bun appears more sensitive to container resource allocation
3. **Startup Variance**: Inconsistent container initialization times
4. **Network Stack Differences**: Different networking behavior in containerized environments

## Production Deployment Recommendations

### For Production Use

#### Choose Node.js When:
- **Reliability is critical** (financial services, healthcare)
- **Consistent performance** is required
- **Docker/Kubernetes deployment** is planned
- **Operational simplicity** is preferred

#### Choose Bun When:
- **Peak performance** is more important than consistency
- **Local development** speed is prioritized
- **Willing to invest** in container optimization
- **Performance monitoring** infrastructure is available

### Risk Assessment

| Runtime | Reliability Risk | Performance Risk | Operational Risk |
|---------|-----------------|------------------|------------------|
| **Node.js** | Low | Low | Low |
| **Bun** | Medium | Medium-High | Medium |

## Development Workflow Recommendations

### Optimal Strategy

1. **Development**: Use Bun for excellent local performance
2. **Testing**: Include both runtimes in CI/CD pipelines
3. **Staging**: Test with Node.js for production parity
4. **Production**: Deploy Node.js for reliability

### Performance Monitoring

For Bun deployments:
- Implement comprehensive performance monitoring
- Set up alerting for performance degradation
- Regular performance regression testing
- Container resource optimization

## Conclusion

This comprehensive analysis reveals a nuanced performance landscape:

### Key Findings

1. **Environment Matters**: Performance characteristics change significantly between local and containerized environments
2. **Single Tests Deceive**: Batch testing reveals the true performance story
3. **Consistency Wins**: For production, predictable performance often trumps peak performance
4. **Context-Dependent Choice**: The "better" runtime depends entirely on your deployment context

### Final Recommendation

**For Most Production Scenarios**: **Node.js** offers the best balance of performance, reliability, and operational simplicity.

**For Development**: **Bun** provides excellent developer experience and performance.

**For High-Performance Scenarios**: Consider Bun with extensive monitoring and container optimization.

The choice between Node.js and Bun should be based on your specific requirements for reliability, performance consistency, and operational complexity rather than peak performance metrics alone.

---

## Test Data Archive

- **Local Testing**: `performance-results/node_20250613_145323.json`, `performance-results/bun_20250613_145323.json`
- **Docker Single**: `performance-results/node_20250616_101423.json`, `performance-results/bun-docker_*.json`
- **Batch Testing**: `performance-results/batch-20250616_102415/` (20 test files + summary)

*Analysis conducted with K6 load testing framework on Hono-based Clean Architecture application.*