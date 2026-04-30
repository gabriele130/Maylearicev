import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false, limit: "10mb" }));

let initPromise: Promise<void> | null = null;

async function init() {
  if (!initPromise) {
    initPromise = (async () => {
      await registerRoutes(app);

      app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("API error:", err);
        if (!res.headersSent) {
          res.status(status).json({ message });
        }
      });
    })();
  }
  return initPromise;
}

export default async function handler(req: Request, res: Response) {
  await init();
  return app(req, res);
}
