import express from 'express';
import { registerUserSchema } from '../validation/auth.js';
import { registerUserController } from '../controllers/auth.js';
import { validateUser } from '../middlewares/validateUser.js';

const router = express.Router();

router.post(
  '/register',
  validateUser(registerUserSchema),
  registerUserController,
);

export default router;
