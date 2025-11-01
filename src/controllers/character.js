import {
  createCharacter,
  getUserCharacters,
  reorderChars,
} from '../services/character.js';
import { uploadToCloudinary } from '../utils/uploadCloudinary.js';
import * as fs from 'node:fs/promises';

export async function createCharacterController(req, res) {
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

export async function deleteCharacterController(req, res) {
  const result = await deleteCharacter(req.params.id, req.user.id);

  if (!result) {
    throw new createHttpError.NotFound('Character not found');
  }

  res.status(204).end();
}
