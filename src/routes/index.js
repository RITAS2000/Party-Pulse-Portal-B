import { Router } from 'express';
import registerRoute from './auth.js';
import charRoute from './character.js';
import allRoute from './all.js';

const router = Router();
router.use('/all', allRoute);
router.use('/auth', registerRoute);
router.use('/char', charRoute);

export default router;
