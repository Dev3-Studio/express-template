import { NextFunction, Request, Response } from 'express';
import { auth } from '@/api/auth.ts';
import { fromNodeHeaders } from 'better-auth/node';

export async function onlyLoggedIn(req: Request, res: Response, next: NextFunction) {
    const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
    });
    if (!session) {
        res.status(401).send({ error: 'Unauthorized' });
        return;
    }
    req.session = session;
    next();
}

export async function onlyAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.session?.user.role === 'admin') {
        next();
        return;
    }
    if (!req.session?.user) {
        res.status(401).send({ error: 'Unauthorized' });
    } else {
        res.status(403).send({ error: 'Forbidden' });
    }
}