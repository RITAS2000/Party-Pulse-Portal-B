import { Router } from 'express';
import registerRoute from './auth.js';
import charRoute from './character.js';
import allRoute from './all.js';
import galleryRoute from './gallery.js';
import clanRoute from './clan.js';
import gvgRoute from './gvg.js';

const router = Router();
router.use('/all', allRoute);
router.use('/auth', registerRoute);
router.use('/char', charRoute);
router.use('/gallery', galleryRoute);
router.use('/clan', clanRoute);
router.use('/gvg', gvgRoute);

export default router;
