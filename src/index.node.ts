import { serve } from '@hono/node-server';
import { createApp } from "@/app";

const app = createApp();

const rawPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
if (!Number.isInteger(rawPort) || rawPort < 1 || rawPort > 65535) {
  throw new Error(`Invalid PORT value: ${process.env.PORT}`);
}
const port = rawPort;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
