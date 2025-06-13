# Hono Bun Clean Architecture

[日本語版 README](./README.ja.md)

## Description

This is a simple project to demonstrate the Clean Architecture using the Hono and Bun as an example.

## Demo

- `/:message` - Returns the message in the path parameter.

  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/HelloWorld>
- `/pokemon/:id` - Returns the pokemon with the id in the path parameter.

  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/pokemon/1>

## Technologies

- Package Manager: Bun
- Database: None
- HTTP Server: Hono
- Test Framework: Bun
- Linter: Biome
- Formatter: Biome

## Development

### Setup

1. install bun
  MacOS:

  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

  <https://bun.sh/docs/installation>

2. Clone the repository

  ```bash
  git clone
  ```

3. Install dependencies

  ```bash
  bun install
  ```

4. Run the project

  ```bash
  bun dev
  ```

### Deploy

```bash
bun run deploy
```

## Node.js Support

This project includes support for running with Node.js in addition to Bun:

### Node.js Development

```bash
npm run dev:node        # Run with hot reload
npm run start:node      # Run without hot reload
```

### Building

```bash
npm run build:node      # Compile TypeScript to JavaScript
node dist/index.node.js # Run compiled version
```

### TypeScript Configuration

- `tsconfig.json` - Base configuration for Cloudflare Workers/Bun
- `tsconfig.node.json` - Node.js-specific configuration

## Docker Support

This project includes Docker support for both Node.js and Bun runtimes.

### Using Docker with Node.js

1. **Build and run**:

   ```bash
   npm run docker:build        # Build production image (compiled JS)
   npm run docker:run          # Run production container
   ```

2. **Docker Compose**:

   ```bash
   npm run docker:compose      # Run with docker-compose
   ```

### Using Docker with Bun

**✅ Update**: The TypeScript interface export issue has been resolved by using `import type` for interfaces. Bun now works correctly with this codebase.

To build and run with Bun:

1. Build and run the Bun-optimized image:

   ```bash
   npm run docker:build:bun    # Build Bun image
   npm run docker:run:bun      # Run Bun container
   ```

2. Debug mode (with full Bun image):

   ```bash
   docker build -t hono-bun-debug -f Dockerfile.bun --build-arg DEBUG=true .
   docker run -p 3000:3000 hono-bun-debug
   ```

### Docker Compose

The project includes a `docker-compose.yml` file with both Node.js and Bun configurations. By default, it uses the Node.js production version. To use the Bun version, edit the `docker-compose.yml` file and comment out the `app` service while uncommenting the `app-bun` service.

The application will be available at `http://localhost:3000`.

## Performance Testing with K6

This project includes K6 load testing scripts to measure performance.

### Installation

```bash
brew install k6
```

### Available Tests

1. **Smoke Test** - Basic functionality check

   ```bash
   k6 run k6-smoke-test.js
   ```

2. **Simple Load Test** - 5 concurrent users for 30 seconds

   ```bash
   k6 run k6-simple-test.js
   ```

3. **Full Load Test** - Gradual ramp up to 10 users over 2 minutes

   ```bash
   k6 run k6-test.js
   ```

4. **Stress Test** - High load test up to 200 users

   ```bash
   k6 run k6-stress-test.js
   ```

### Running Tests with Docker

```bash
# Start the server
docker run -d -p 3000:3000 --name test-server hono-bun-app

# Run K6 test
k6 run k6-simple-test.js

# Save results to JSON
k6 run --out json=results.json k6-simple-test.js

# Analyze results
node analyze-k6-results.js results.json
```

### Automated Performance Comparison

Use the included script to compare Node.js and Bun performance:

```bash
./compare-performance.sh
```

This script will:

- Start both Node.js and Bun servers
- Run K6 tests against both
- Save results with timestamps
- Display a comparison

### Performance Results

Typical performance metrics with 5 concurrent users for 30 seconds:

#### Node.js (Docker)

- **Average Response Time**: ~25ms
- **95th Percentile**: ~65ms
- **Throughput**: ~200 requests/second
- **Total Requests**: ~6,000

#### Bun (Local)

- **Average Response Time**: ~15ms
- **95th Percentile**: ~32ms
- **Throughput**: ~334 requests/second
- **Total Requests**: ~10,000

**Performance Improvement with Bun**: ~40% faster response times and ~67% higher throughput

## TypeScript Interface Resolution

When using Bun, TypeScript interfaces must be imported using `import type`:

```typescript
// ❌ Will cause error in Bun
import { PokemonRepository } from "@/application/repositories/pokemon/pokemon";

// ✅ Correct way for Bun
import type { PokemonRepository } from "@/application/repositories/pokemon/pokemon";
```

This is because TypeScript interfaces don't exist at runtime, and Bun's module resolution expects runtime exports.
