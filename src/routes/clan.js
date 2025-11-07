import express from 'express';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import {
  addCharToClanController,
  addClansController,
} from '../controllers/clan.js';
import { getClansController } from '../controllers/clan.js';
import { deleteClanController } from '../controllers/clan.js';
import { validateUser } from '../middlewares/validateUser.js';
import { clanValidationSchema } from '../validation/clan.js';
import { getClanByIdController } from '../controllers/clan.js';
import {
  getClanMessageController,
  upsertMessageController,
} from '../controllers/clan.js';

const router = express.Router();
router.get('/', auth, getClansController);
router.patch('/add-message', auth, upsertMessageController);
router.patch('/add-char', auth, addCharToClanController);
router.get('/:clanId', getClanByIdController);
router.get('/:clanId/message', getClanMessageController);
router.post(
  '/add',
  auth,
  upload.single('logo', (req, res, next) => {
    req.body.userId = req.user.id;
    next();
  }),
  validateUser(clanValidationSchema),
  addClansController,
);
router.delete('/:clanId', auth, deleteClanController);

export default router;
