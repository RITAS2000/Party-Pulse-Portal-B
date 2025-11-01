import { CharactersCollection } from '../db/models/character.js';

export function createCharacter(payload) {
  return CharactersCollection.create(payload);
}

export function getUserCharacters(userId) {
  return CharactersCollection.find({ userId }).sort({ order: 1 });
}

export const reorderChars = async (order) => {
  if (!Array.isArray(order)) {
    throw new Error('Invalid order data format');
  }

  const updates = order.map(({ id, order }) =>
    CharactersCollection.findByIdAndUpdate(id, { order }, { new: true }),
  );

  await Promise.all(updates);
};

export function deleteCharacter(charId, userId) {
  return CharactersCollection.findOneAndDelete({ _id: charId, userId });
}
