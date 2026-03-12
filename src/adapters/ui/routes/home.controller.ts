import { injectable } from "inversify";
import { Context } from "hono";
import { BaseController } from "./base.controller";

@injectable()
export class HomeController implements BaseController {
  constructor() {}

  async main(c: Context) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hono Clean Architecture API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .container { max-width: 640px; width: 100%; padding: 2rem; }
    h1 { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: #f8fafc; }
    .subtitle { color: #94a3b8; margin-bottom: 2rem; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem; }
    .card h2 { font-size: 1.1rem; color: #f8fafc; margin-bottom: 1rem; }
    .endpoint { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: #0f172a; border-radius: 0.5rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit; transition: background 0.15s; }
    .endpoint:hover { background: #1a2744; }
    .method { background: #065f46; color: #6ee7b7; font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.5rem; border-radius: 0.25rem; }
    .path { color: #93c5fd; font-family: monospace; font-size: 0.9rem; }
    .desc { color: #94a3b8; font-size: 0.85rem; }
    .tech { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
    .badge { background: #1e293b; border: 1px solid #334155; color: #94a3b8; font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 9999px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hono Clean Architecture API</h1>
    <p class="subtitle">A demo API built with Clean Architecture principles</p>
    <div class="card">
      <h2>API Endpoints</h2>
      <a class="endpoint" href="/pokemon/25">
        <span class="method">GET</span>
        <span class="path">/pokemon/:id</span>
        <span class="desc">— Get Pokémon by ID (1-898)</span>
      </a>
      <a class="endpoint" href="/hello">
        <span class="method">GET</span>
        <span class="path">/:message</span>
        <span class="desc">— Echo back a message</span>
      </a>
    </div>
    <div class="tech">
      <span class="badge">Hono</span>
      <span class="badge">Bun</span>
      <span class="badge">Clean Architecture</span>
      <span class="badge">InversifyJS</span>
      <span class="badge">TypeScript</span>
    </div>
  </div>
</body>
</html>`;

    return c.html(html);
  }
}
