import express from 'express';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  resetPasswordController,
  SendResetEmailController,
} from '../controllers/auth.js';
import { validateUser } from '../middlewares/validateUser.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post(
  '/register',
  validateUser(registerUserSchema),
  registerUserController,
);
router.post('/login', validateUser(loginUserSchema), loginUserController);
router.post('/logout', auth, logoutUserController);
router.post('/forgot-password', SendResetEmailController);
router.post('/reset-password', resetPasswordController);
export default router;
