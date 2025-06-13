# K6 Performance Testing Suite

[日本語版 README](./README.ja.md)

This directory contains a comprehensive K6 load testing suite for performance analysis and benchmarking.

## Test Files

### Basic Tests

- **`k6-smoke-test.js`** - Smoke test for basic functionality validation
  - 1 virtual user for 30 seconds
  - Validates core endpoints are working

- **`k6-simple-test.js`** - Simple load test
  - 5 concurrent users for 30 seconds
  - Good for regular performance monitoring

### Advanced Tests

- **`k6-test.js`** - Full load test with gradual ramp-up
  - Stages: 2 users → 5 users → 10 users → 5 users → 0 users
  - 2-minute duration with realistic load patterns

- **`k6-stress-test.js`** - High-load stress test
  - Ramps up to 200 concurrent users
  - Tests system limits and stability under extreme load

## Analysis Tools

- **`analyze-k6-results.js`** - Results analyzer
  - Processes K6 JSON output files
  - Generates detailed performance metrics and summaries

## Usage

### Prerequisites

```bash
# Install K6
brew install k6  # macOS
# or follow instructions at https://k6.io/docs/getting-started/installation/
```

### Running Tests

1. **Start your server** (choose one):

   ```bash
   # Local development
   bun dev                    # Cloudflare Workers
   npm run dev:node          # Node.js with hot reload

   # Docker
   npm run docker:run        # Node.js production
   npm run docker:run:bun    # Bun production
   ```

2. **Run K6 tests**:

   ```bash
   # Basic smoke test
   k6 run k6-tests/k6-smoke-test.js

   # Simple load test
   k6 run k6-tests/k6-simple-test.js

   # Full load test
   k6 run k6-tests/k6-test.js

   # Stress test
   k6 run k6-tests/k6-stress-test.js
   ```

3. **Save and analyze results**:

   ```bash
   # Save results to JSON
   k6 run --out json=results.json k6-tests/k6-simple-test.js

   # Analyze results
   node k6-tests/analyze-k6-results.js results.json
   ```

### Automated Performance Comparison

Use the root-level comparison script for automated testing:

```bash
./compare-performance.sh
```

This script will:

- Run tests against both Node.js and Bun implementations
- Save timestamped results in `performance-results/` directory
- Display performance comparison

## Test Configuration

### Base URL

Tests default to `http://localhost:3000`. Override with environment variable:

```bash
BASE_URL=http://localhost:8080 k6 run k6-tests/k6-simple-test.js
```

### Test Endpoints

All tests validate these endpoints:

- `GET /hello` - Basic health check
- `GET /pokemon/1` - Pokemon API integration
- `GET /pokemon/25` - Additional Pokemon test (Pikachu)

### Performance Thresholds

Tests include built-in performance thresholds:

- 95% of requests must complete within 500ms
- HTTP error rate must be less than 1%
- Average response time should be under 200ms

## Expected Performance Metrics

### Node.js (Docker)

- **Average Response Time**: ~25ms
- **95th Percentile**: ~65ms
- **Throughput**: ~200 requests/second
- **Total Requests**: ~6,000 (30s test)

### Bun (Local)

- **Average Response Time**: ~15ms
- **95th Percentile**: ~32ms
- **Throughput**: ~334 requests/second
- **Total Requests**: ~10,000 (30s test)

**Performance Improvement**: Bun typically shows ~40% faster response times and ~67% higher throughput.

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure server is running on the correct port
   - Check BASE_URL environment variable

2. **High error rates**
   - Verify Pokemon API is accessible
   - Check SSL certificate settings (NODE_TLS_REJECT_UNAUTHORIZED=0 for development)

3. **Inconsistent results**
   - Run multiple test iterations
   - Ensure system is not under other load during testing
   - Use Docker for consistent environments

### SSL Certificate Issues

For development with self-signed certificates:

```bash
export NODE_TLS_REJECT_UNAUTHORIZED=0
```

## Integration with CI/CD

These tests can be integrated into automated pipelines:

```yaml
# Example GitHub Actions step
- name: Run K6 Performance Tests
  run: |
    docker run -d -p 3000:3000 --name test-app hono-node-app
    k6 run --out json=results.json k6-tests/k6-simple-test.js
    node k6-tests/analyze-k6-results.js results.json
```

## Contributing

When adding new tests:

1. Follow the existing naming convention: `k6-{test-type}-test.js`
2. Include appropriate thresholds and checks
3. Add documentation to this README
4. Test against both Node.js and Bun implementations
