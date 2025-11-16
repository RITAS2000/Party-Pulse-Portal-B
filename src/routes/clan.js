import express from 'express';
import { auth } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';
import {
  acceptCharToClanController,
  addCharToClanController,
  addClansController,
  addOfficerController,
  notAcceptCharToClanController,
  removeOfficerController,
  transferLeadershipController,
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
router.patch('/accept-char', auth, acceptCharToClanController);
router.delete('/not-accept-char', auth, notAcceptCharToClanController);
router.patch('/add-char', auth, addCharToClanController);
router.patch('/add-officer', auth, addOfficerController);
router.patch('/remove-officer', auth, removeOfficerController);
router.patch('/transferLeadership', auth, transferLeadershipController);
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
