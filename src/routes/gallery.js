import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  addGalleryCharactersController,
  getGalleryController,
  removeGalleryCharactersController,
  toggleApprovController,
} from '../controllers/gallery.js';

const router = express.Router();
router.get('/', auth, getGalleryController);
router.post('/add', auth, addGalleryCharactersController);
router.delete('/:galleryId', auth, removeGalleryCharactersController);
router.patch('/:galleryId', auth, toggleApprovController);

export default router;
