import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { fromError } from 'zod-validation-error';
import { BadRequestError } from '@/lib/httpErrors.ts';

export function parseBodyMiddleware(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.parsedBody = schema.parse(req.body);
            next();
        } catch (err) {
            const validationError = fromError(err);
            const errorMessage = '[Invalid body] ' + validationError.toString();
            console.error(validationError);
            throw new BadRequestError(errorMessage);
        }
    };
}

export function parseQueryMiddleware(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.parsedQuery = schema.parse(req.query);
            next();
        } catch (err) {
            const validationError = fromError(err);
            const errorMessage = '[Invalid query] ' + validationError.toString();
            console.error(validationError);
            throw new BadRequestError(errorMessage);
        }
    };
}

export function parseParamsMiddleware(schema: z.ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            res.locals.parsedParams = schema.parse(req.params);
            next();
        } catch (err) {
            const validationError = fromError(err);
            const errorMessage = '[Invalid params] ' + validationError.toString();
            console.error(validationError);
            throw new BadRequestError(errorMessage);
        }
    };
}