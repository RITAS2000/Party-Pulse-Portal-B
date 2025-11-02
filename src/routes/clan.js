import express from 'express';
import { auth } from '../middlewares/auth.js';
import {} from '../controllers/clan.js';
import { upload } from '../middlewares/upload.js';
import { addClansController } from '../controllers/clan.js';
import { getClansController } from '../controllers/clan.js';

const router = express.Router();
router.get('/', auth, getClansController);
router.post(
  '/add',
  auth,
  upload.single('logo', (req, res, next) => {
    req.body.userId = req.user.id;
    next();
  }),
  addClansController,
);

export default router;
