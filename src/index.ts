import app from './api/index.ts';
import { env } from '@/lib/env.ts';

async function init() {
    console.log(`[Server] Starting server in ${env.NODE_ENV} mode...`);
    app.listen(env.PORT, () => {
        console.log(`[Server] Server is running on http://localhost:${env.PORT}`);
    });
}

void init();