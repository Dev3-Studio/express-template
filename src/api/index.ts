import express from 'express';
import cors from 'cors';
import { env } from '@/lib/env.ts';
import { exceptionHandler } from './middleware/exception.ts';
import { router as exampleRouter } from '@/api/components/example/index.ts';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.ts';
import helmet from 'helmet';
import { NextFunction } from 'npm:grammy@1.34.0';
import { Request, Response } from 'express';

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: [
                'https://cdn.jsdelivr.net/npm/@scalar/api-reference', // Allow Better-Auth API reference scripts
            ],
        },
    },
}));

// Resolve CORS
console.log(`[CORS Setup] Allowed Origins from .env: '${env.ALLOWED_ORIGINS}'`);
app.use(
    cors({
        origin: env.ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }),
);

// Logging middleware
if (env.NODE_ENV === 'development') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
        console.log(`[Request] ${req.method} ${req.originalUrl}`);
        next();
    });
}

// Better-Auth routes
app.all('/auth/*splat', toNodeHandler(auth));

// Parse JSON
app.use(express.json());

// Register routers
app.use('/example', exampleRouter);

// Health check route
app.get('/ping', (_req: Request, res: Response) => {
    res.status(200).send({ message: 'pong' });
});

// Error handling
app.use(exceptionHandler);

export default app;