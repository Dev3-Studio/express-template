import "jsr:@std/dotenv/load";
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        host: Deno.env.get("DB_HOST")!,
        port: parseInt(Deno.env.get("DB_PORT")!),
        user: Deno.env.get("DB_USER")!,
        password: Deno.env.get("DB_PASS")!,
        database: Deno.env.get("DB_NAME")!,
        ssl: 'require',
    },
    casing: 'snake_case',
});
