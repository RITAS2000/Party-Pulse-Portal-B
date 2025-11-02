import { ClansCollection } from '../db/models/clan.js';

export function createClan(payload) {
  return ClansCollection.create(payload);
}

export async function getAllClans() {
  const clans = await ClansCollection.find().lean();
  return clans;
}
