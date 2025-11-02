import {
  addCharacterToGallery,
  getAllGallery,
  removeCharacterToGallery,
  toggleApprov,
} from '../services/gallery.js';

export async function addGalleryCharactersController(req, res) {
  const userId = req.user.id;
  const { charId } = req.body;

  const galleryChar = await addCharacterToGallery(charId, userId);
  res.status(201).json({
    message: 'Character successfully added to gallery',
    data: galleryChar,
  });
}

export async function removeGalleryCharactersController(req, res) {
  const galleryId = req.params.galleryId;
  const userId = req.user.id;

  if (!galleryId)
    return res.status(400).json({ message: 'galleryId is required' });

  const deleted = await removeCharacterToGallery(galleryId, userId);

  if (!deleted)
    return res.status(404).json({ message: 'Character not found in gallery' });

  return res.sendStatus(204);
}

export async function getGalleryController(req, res) {
  const gallery = await getAllGallery();

  res.status(200).json(gallery);
}

export async function toggleApprovController(req, res) {
  console.log('🚀 ~ toggleApprovController ~ params:', req.params);
  const { galleryId } = req.params;

  console.log('🚀 ~ toggleApprovController ~ galleryId:', galleryId);

  if (!galleryId)
    return res.status(400).json({ message: 'Missing gallery item id' });

  const updatedItem = await toggleApprov(galleryId);

  res.status(200).json(updatedItem);
}
