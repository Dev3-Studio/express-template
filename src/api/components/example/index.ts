import { Router } from 'express';
import { onlyLoggedIn } from '@/api/middleware/auth.ts';
import * as controller from './controllers.ts';

const router = Router();

router.get('/',
    onlyLoggedIn,
    controller.getExample,
);

export { router };