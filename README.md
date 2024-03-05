# Hono Bun Clean Architecture

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
