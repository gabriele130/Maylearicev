import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Make sure your database is provisioned.");
}

const connectionString = process.env.DATABASE_URL;

// Detect serverless environment (Vercel, AWS Lambda, etc.) so we can tune the
// pool: serverless functions are short-lived and can't keep many idle TCP
// connections open without exhausting the database.
const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

// Neon and most managed Postgres providers require TLS. The `postgres` driver
// does NOT enable SSL by default — we have to opt in. We force SSL whenever
// the connection string targets a managed provider or explicitly requests it.
const needsSsl =
  /sslmode=require/i.test(connectionString) ||
  /neon\.tech|render\.com|supabase\.co|aws\.com|amazonaws\.com|azure\.com/i.test(connectionString);

console.log(
  `Connecting to database (serverless=${isServerless}, ssl=${needsSsl})...`,
);

const client = postgres(connectionString, {
  ssl: needsSsl ? "require" : undefined,
  max: isServerless ? 1 : 10,
  idle_timeout: isServerless ? 20 : undefined,
  connect_timeout: 10,
  prepare: false,
});

export const db = drizzle(client, { schema });