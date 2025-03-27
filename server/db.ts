import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Make sure your database is provisioned.");
}

console.log("Connecting to database...");
const connectionString = process.env.DATABASE_URL;
// For Replit, we need to use direct SQL connection instead of WebSockets
const client = postgres(connectionString);
export const db = drizzle(client, { schema });