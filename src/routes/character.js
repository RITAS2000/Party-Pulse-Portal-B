import express from 'express';
import { characterSchema } from '../validation/character.js';
import {
  createCharacterController,
  deleteCharacterController,
  gerCharByIdController,
  getAllCarsController,
  getUserCharactersController,
  reorderCharsController,
} from '../controllers/character.js';
import { validateUser } from '../middlewares/validateUser.js';
import { upload } from '../middlewares/upload.js';
import { auth } from '../middlewares/auth.js';
import { updateCharacterLevel } from '../controllers/all.js';

const router = express.Router();

router.get('/collection', auth, getUserCharactersController);
router.get('/:charId', auth, gerCharByIdController);
router.get('/', auth, getAllCarsController);

router.post(
  '/add',
  auth,
  upload.single('avatar', (req, res, next) => {
    req.body.userId = req.user.id;
    next();
  }),
  validateUser(characterSchema),
  createCharacterController,
);

router.patch('/reorder', reorderCharsController);
router.patch('/:id', updateCharacterLevel);
router.delete('/:charId', auth, deleteCharacterController);
export default router;
