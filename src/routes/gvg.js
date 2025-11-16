import express from 'express';
import { gvgCreateController } from '../controllers/gvg.js';
import { auth } from '../middlewares/auth.js';
import { gvgValidationSchema } from '../validation/gvg.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = express.Router();

router.post(
  '/create',
  auth,
  validateBody(gvgValidationSchema),
  gvgCreateController,
);
export default router;
