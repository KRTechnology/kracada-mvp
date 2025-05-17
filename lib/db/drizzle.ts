// import { config } from "dotenv";
// import { drizzle } from "drizzle-orm/neon-http";

// config({ path: ".env" }); // or .env.local

// export const db = drizzle(process.env.DATABASE_URL!);

import { config } from "dotenv";
import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";

config({ path: ".env" }); // or .env.local
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool);
