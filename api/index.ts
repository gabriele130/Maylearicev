import type { IncomingMessage, ServerResponse } from "http";

type Handler = (req: IncomingMessage, res: ServerResponse) => unknown;

let cached: Handler | null = null;

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  if (!cached) {
    // The bundled application is produced by `vercel.json` buildCommand
    // (esbuild bundles server/vercelEntry.ts -> api/_bundle.mjs). We use a
    // dynamic import so Vercel's static type-check doesn't require the file
    // to exist at deploy validation time.
    const mod: any = await import("./_bundle.mjs");
    cached = (mod.default ?? mod) as Handler;
  }
  return cached!(req, res);
}
