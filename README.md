# Hono Bun Clean Architecture

[日本語版 README](./README.ja.md) | [📊 Performance Analysis](./docs/PERFORMANCE_ANALYSIS_COMPLETE.md)

## Description

A Clean Architecture implementation using Hono framework with support for both Bun and Node.js runtimes. This project demonstrates modern TypeScript development with Docker deployment and comprehensive performance testing.

## Demo

- `/:message` - Returns the message from the path parameter.
  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/HelloWorld>
- `/pokemon/:id` - Returns the Pokemon corresponding to the path parameter ID.
  <https://hono-bun-clean-architecture.ken0421wabu.workers.dev/pokemon/1>

## Features

- 🏗️ **Clean Architecture** - Separation of concerns with clear dependency boundaries
- 🚀 **Dual Runtime Support** - Works with both Bun and Node.js
- 🐳 **Docker Ready** - Production-ready containerization
- 📊 **Performance Testing** - Comprehensive K6 load testing suite
- 🔧 **TypeScript** - Full type safety with modern TS features
- ✨ **Hot Reload** - Fast development experience

## Tech Stack

- **Package Manager**: Bun
- **HTTP Server**: Hono
- **Test Framework**: Bun
- **Linter/Formatter**: Biome
- **Containerization**: Docker & Docker Compose
- **Performance Testing**: K6

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/docs/installation) (recommended) or Node.js 20+
- Docker (optional, for containerized deployment)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd hono-bun-cleanArchitecture

# Install dependencies
bun install

# Start development server
bun dev
```

The application will be available at `http://localhost:3000`.

## Development

### Available Scripts

```bash
# Development
bun dev                 # Start with Bun (recommended)
npm run dev:node        # Start with Node.js

# Production
bun run deploy          # Deploy to Cloudflare Workers
npm run start:node      # Run Node.js production server

# Testing
bun test                # Run tests
bun test:watch          # Run tests in watch mode
bun test:coverage       # Run tests with coverage

# Code Quality
bun run lint            # Run linter
bun run format          # Format code
bun run typecheck       # Type checking
```

## Docker Deployment

### Node.js (Recommended for Production)

```bash
npm run docker:build    # Build production image
npm run docker:run      # Run container
```

### Bun

```bash
npm run docker:build:bun # Build Bun image
npm run docker:run:bun   # Run Bun container
```

### Docker Compose

```bash
npm run docker:compose   # Run with docker-compose
```

## Performance Testing

This project includes comprehensive performance testing with K6.

### Quick Performance Test

```bash
# Install K6
brew install k6  # macOS

# Run performance comparison
./compare-performance.sh
```

### Performance Summary

Based on extensive testing (local, Docker, and statistical analysis):

| Environment | Best Runtime | Key Advantage |
|-------------|-------------|---------------|
| **Local Development** | Bun | 4.3% faster, better developer experience |
| **Docker Production** | Node.js | More consistent, reliable performance |
| **Overall Recommendation** | Context-dependent | See [full analysis](./docs/PERFORMANCE_ANALYSIS_COMPLETE.md) |

📊 **[Complete Performance Analysis](./docs/PERFORMANCE_ANALYSIS_COMPLETE.md)** - Detailed comparison with statistical significance testing.

🧪 **[K6 Testing Guide](./k6-tests/README.md)** - Comprehensive testing documentation.

## Architecture

This project follows Clean Architecture principles:

- **Domain Layer** (`src/domain/`) - Pure business logic
- **Application Layer** (`src/application/`) - Use cases and interfaces
- **Adapters Layer** (`src/adapters/`) - External integrations
- **Infrastructure Layer** - Framework-specific code

Key patterns:

- Dependency Injection (InversifyJS)
- Repository Pattern
- Value Objects
- Domain Error Handling

## Documentation

- [📊 Performance Analysis](./docs/PERFORMANCE_ANALYSIS_COMPLETE.md) - Complete runtime comparison
- [🧪 K6 Testing Guide](./k6-tests/README.md) - Load testing documentation
- [🤖 Claude.md](./CLAUDE.md) - AI assistant guidelines

## License

This project is for demonstration purposes.
