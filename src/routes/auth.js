import express from 'express';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginUserController,
  registerUserController,
} from '../controllers/auth.js';
import { validateUser } from '../middlewares/validateUser.js';

const router = express.Router();

router.post(
  '/register',
  validateUser(registerUserSchema),
  registerUserController,
);
router.post('/login', validateUser(loginUserSchema), loginUserController);

export default router;
