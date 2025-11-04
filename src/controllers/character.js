import {
  createCharacter,
  getAllChars,
  getCharById,
  getUserCharacters,
  reorderChars,
} from '../services/character.js';
import { uploadToCloudinary } from '../utils/uploadCloudinary.js';
import * as fs from 'node:fs/promises';

export async function createCharacterController(req, res) {
  const { nickname, server } = req.body;

  const existing = await CharactersCollection.findOne({
    userId: req.user.id,
    server,
    nickname: { $regex: new RegExp(`^${nickname}$`, 'i') },
  });

  if (existing) {
    return res.status(400).json({
      status: 400,
      message: `A character with the nickname "${nickname}" already exists on the server "${server}"`,
    });
  }
  const result = await uploadToCloudinary(req.file.path);
  await fs.unlink(req.file.path);
  const character = await createCharacter({
    ...req.body,
    avatar: result.secure_url,
    userId: req.user.id,
  });

  res
    .status(201)
    .set('Content-Type', 'application/json')
    .send(
      JSON.stringify(
        {
          status: 201,
          message: 'Successfully created a character!',
          charData: character,
        },
        null,
        2,
      ),
    );
}

export async function getUserCharactersController(req, res) {
  const userId = req.user.id;
  const characters = await getUserCharacters(userId);

  res.status(200).json({ characters });
}

export const reorderCharsController = async (req, res) => {
  const { order } = req.body;
  await reorderChars(order);
  res.status(200).json({ message: '✅ Order updated successfully' });
};
import createHttpError from 'http-errors';
import { deleteCharacter } from '../services/character.js';
import { GalleryCharacters } from '../db/models/gallery.js';
import { CharactersCollection } from '../db/models/character.js';

export async function deleteCharacterController(req, res) {
  const result = await deleteCharacter(req.params.charId, req.user.id);

  if (!result) {
    throw new createHttpError.NotFound('Character not found');
  }
  await GalleryCharacters.deleteMany({ originalCharId: req.params.charId });
  res.status(204).end();
}

export async function gerCharByIdController(req, res) {
  const { charId } = req.params;

  const char = await getCharById(charId);
  if (!char) {
    return res.status(404).json({ message: 'Character not found' });
  }

  res.status(200).json({ char });
}

export async function getAllCarsController(req, res) {
  const result = await getAllChars();

  res.status(200).json({ result });
}
