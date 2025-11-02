import { CharactersCollection } from '../db/models/character.js';
import { GalleryCharacters } from '../db/models/gallery.js';

export async function addCharacterToGallery(charId, userId) {
  const original = await CharactersCollection.findById(charId);
  if (!original) {
    throw new Error(`Character with id ${charId} not found`);
  }
  const existing = await GalleryCharacters.findOne({
    originalCharId: original._id,
    userId: userId,
  });

  if (existing) {
    return existing;
  }
  const copy = await GalleryCharacters.create({
    originalCharId: original._id,
    userId,
    nickname: original.nickname,
    race: original.race,
    level: original.level,
    avatar: original.avatar,
    server: original.server,
    isApproved: false,
  });
  return copy;
}

export async function removeCharacterToGallery(galleryId, userId) {
  const deleted = await GalleryCharacters.findOneAndDelete({
    _id: galleryId,
    userId,
  });

  return deleted;
}

export async function getAllGallery() {
  const gallery = await GalleryCharacters.find().sort({ createdAt: -1 });
  return gallery;
}

export async function toggleApprov(_id) {
  const item = await GalleryCharacters.findById(_id);
  if (!item) throw new Error('Gallery item not found');

  item.isApproved = true;
  await item.save();

  return item;
}
