import { Router } from 'express';
import registerRoute from './auth.js';

const router = Router();

router.use('/auth', registerRoute);

export default router;
