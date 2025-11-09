// import mongoose from 'mongoose';
// import { CharactersCollection } from '../db/models/character.js';
import { ClansCollection } from '../db/models/clan.js';

export function createClan(payload) {
  return ClansCollection.create(payload);
}

export async function getAllClans() {
  const clans = await ClansCollection.find().lean();
  return clans;
}
// export async function deleteClan(clanId, userId) {
//   const clan = await ClansCollection.findOneAndDelete({
//     _id: clanId,
//     leaderId: userId,
//   });

//   if (!clan) return null;

//   await CharactersCollection.updateMany(
//     { 'clan.clanId': new mongoose.Types.ObjectId(clanId) },
//     {
//       $unset: { 'clan.clanId': '' },
//       $set: {
//         'clan.accepted': false,
//         'clan.role': 'member',
//       },
//     },
//   );

//   return clan;
// }

export function getClanById(clanId) {
  return ClansCollection.findById(clanId);
}

export async function setClanMessage(clanId, message) {
  const updatedClan = await ClansCollection.findByIdAndUpdate(
    clanId,
    { message },
    { new: true },
  );
  return updatedClan?.message || null;
}

export async function getClanMessage(clanId) {
  const clan = await ClansCollection.findById(clanId).select('message');
  return clan?.message || null;
}
