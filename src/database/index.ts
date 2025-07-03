import { drizzle } from 'drizzle-orm/node-postgres';
import fs from "node:fs";
import * as schema from './schema.ts';
import { env } from '@/lib/env.ts';

function getCertificate(): string {
    if (env.DB_CERT) return env.DB_CERT;
    if (env.DB_CERT_PATH) {
        return fs.readFileSync(env.DB_CERT_PATH, 'utf8');
    }
    return '';
}

export const database = drizzle({
    connection: {
        connectionString: `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
        ssl: {
            ca: getCertificate(),
        },
    },
    schema: schema,
    casing: 'snake_case',
});

export type DatabaseClient = typeof database;
export type DatabaseTransaction = Parameters<Parameters<DatabaseClient['transaction']>[0]>[0];
export type DatabaseConnection = DatabaseClient | DatabaseTransaction;

export * from "./schema.ts";