# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

- **Run development server (Cloudflare)**: `bun dev`
- **Run development server (Node.js)**: `npm run dev:node`
- **Run production server (Node.js)**: `npm run start:node`
- **Run all tests**: `bun test`
- **Run tests in watch mode**: `bun test:watch`
- **Run tests with coverage**: `bun test:coverage`
- **Run linting**: `bun run lint`
- **Format code**: `bun run format`
- **Type check**: `bun run typecheck`
- **Type check (Node.js)**: `npm run typecheck:node`
- **Build Node.js**: `npm run build:node`
- **Deploy to Cloudflare Workers**: `bun run deploy`
- **Build Docker image**: `npm run docker:build`
- **Run Docker container**: `npm run docker:run`
- **Run with Docker Compose**: `npm run docker:compose`

## Architecture Overview

This project follows Clean Architecture principles with clear separation of concerns:

### Layer Structure

1. **Domain Layer** (`src/domain/`): Pure business logic with no external dependencies
   - Contains entities, value objects, and domain errors
   - Example: `PokemonId` value object validates IDs between 1-898

2. **Application Layer** (`src/application/`): Application business rules
   - Defines repository interfaces and use cases
   - Orchestrates domain logic without framework dependencies

3. **Adapters Layer** (`src/adapters/`): Interface adapters
   - `gateways/`: External service implementations (e.g., Pokemon API)
   - `ui/routes/`: Web controllers and presenters

4. **Infrastructure Layer**: Framework-specific code
   - `src/index.ts`: Cloudflare Workers entry point
   - `src/index.node.ts`: Node.js entry point
   - `src/container.ts`: Dependency injection configuration
   - `src/router/`: Routing setup
   - `src/middleware/`: HTTP middleware

### Key Patterns

- **Dependency Injection**: Uses InversifyJS with symbols defined in `src/keys.ts`
- **Repository Pattern**: Interfaces in application layer, implementations in adapters
- **Presenter Pattern**: Transforms use case outputs for the view layer
- **Value Objects**: Domain validation encapsulated in objects like `Numberable`
- **Error Handling**: Custom domain errors with HTTP status codes, centralized middleware

### Testing Convention

- Test files follow `.test.ts` naming convention alongside source files
- Uses Bun's built-in test runner

### Framework Notes

- Built for Cloudflare Workers, Node.js, and Bun deployment
- Uses Hono as the web framework
- Controllers must not pass framework-specific objects to use cases
- **Important for Bun**: TypeScript interfaces must be imported using `import type` syntax to avoid runtime errors

### Performance Testing

- Run `./compare-performance.sh` to compare Node.js and Bun performance
- Results are saved in `performance-results/` directory with timestamps
- Bun typically shows ~40% faster response times and ~67% higher throughput
