import { Request, Response } from 'express';
import * as services from "./services.ts";

export async function getExample(req: Request, res: Response) {
    const user = req.session!.user;
    const example = await services.getExample(user.id);
    res.status(200).send(example);
}

