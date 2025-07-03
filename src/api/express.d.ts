import { auth } from './auth.ts';
import 'express';

export { };

declare module 'express' {
    interface Request {
        session?: typeof auth.$Infer.Session;
    }
    
    interface Response {
        locals: {
            parsedBody?: unknown;
            parsedQuery?: unknown;
            parsedParams?: unknown;
        }
    }
}