import "jsr:@std/dotenv/load";
import { z } from 'zod';

const envSchema = z.object({
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().int().min(1).max(65535),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_NAME: z.string(),
    DB_CERT: z.string().optional(),
    DB_CERT_PATH: z.string().optional().default('./ca-certificate.crt'),
    ALLOWED_ORIGINS: z.preprocess((val) => String(val).split(','), z.array(z.string().url())),
    PORT: z.coerce.number().int().min(1).max(65535).default(5000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    
    BACKEND_DOMAIN: z.string().url().default('http://localhost:5000'),

    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    TWITTER_CLIENT_ID: z.string(),
    TWITTER_CLIENT_SECRET: z.string(),
    
    MAILJET_API_KEY: z.string(),
    MAILJET_SECRET: z.string(),
});

export const env = envSchema.parse(Deno.env.toObject());