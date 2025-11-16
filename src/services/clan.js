import mongoose from 'mongoose';
import { CharactersCollection } from '../db/models/character.js';
import { ClansCollection } from '../db/models/clan.js';
import { UsersCollection } from '../db/models/user.js';
import { GvgCollections } from '../db/models/gvg.js';

export function createClan(payload) {
  return ClansCollection.create(payload);
}

export async function getAllClans() {
  const clans = await ClansCollection.find().lean();
  return clans;
}
export async function deleteClan(clanId, userId) {
  const clan = await ClansCollection.findOneAndDelete({
    _id: clanId,
    leaderId: userId,
  });

  if (!clan) return null;
  await UsersCollection.updateMany(
    { clansId: new mongoose.Types.ObjectId(clanId) },
    { $pull: { clansId: new mongoose.Types.ObjectId(clanId) } },
  );
  await CharactersCollection.updateMany(
    { 'clan.clanId': new mongoose.Types.ObjectId(clanId) },
    {
      $unset: { 'clan.clanId': '' },
      $set: {
        'clan.accepted': false,
        'clan.role': 'member',
      },
    },
  );
  await GvgCollections.deleteMany({
    clanId: new mongoose.Types.ObjectId(clanId),
  });

  return clan;
}

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
export async function addOfficer({ userId, charId, clanId }) {
  // Знаходимо клан
  const clan = await ClansCollection.findById(clanId);
  if (!clan) {
    return { status: 404, message: 'Clan not found' };
  }

  // Тільки лідер може призначати офіцера
  if (clan.leaderId.toString() !== userId.toString()) {
    return { status: 403, message: 'Only the leader can assign officers' };
  }

  // Знаходимо персонажа
  const char = await CharactersCollection.findById(charId);
  if (!char) {
    return { status: 404, message: 'Character not found' };
  }

  // Перевіряємо, чи персонаж у цьому клані
  if (!char.clan?.clanId || char.clan.clanId.toString() !== clanId.toString()) {
    return { status: 400, message: 'Character does not belong to this clan' };
  }

  // Якщо персонаж уже офіцер або лідер — не міняємо
  if (char.clan.role === 'officer' || char.clan.role === 'leader') {
    return { status: 400, message: 'Character already has elevated role' };
  }

  // ✅ Призначаємо офіцером
  char.clan.role = 'officer';
  await char.save();

  return {
    status: 200,
    message: 'Character successfully promoted to officer',
    updatedChar: char,
  };
}

export async function removeOfficer({ userId, charId, clanId }) {
  const clan = await ClansCollection.findById(clanId);
  if (!clan) throw { status: 404, message: 'Clan not found' };

  if (clan.leaderId.toString() !== userId.toString()) {
    throw { status: 403, message: 'Only leader can remove officer' };
  }

  const char = await CharactersCollection.findById(charId);
  if (!char) throw { status: 404, message: 'Character not found' };

  if (!char.clan?.clanId || char.clan.clanId.toString() !== clanId.toString()) {
    throw { status: 400, message: 'Character is not in this clan' };
  }

  if (char.clan.role !== 'officer') {
    throw { status: 400, message: 'Character is not an officer' };
  }

  char.clan.role = 'member';
  await char.save();

  return char;
}

export async function transferLeadership(
  clanId,
  newLeaderCharId,
  currentUserId,
) {
  const clan = await ClansCollection.findById(clanId);
  if (!clan) throw new Error('Clan not found');

  if (clan.leaderId.toString() !== currentUserId.toString()) {
    throw new Error('Only current leader can transfer leadership');
  }

  const newLeaderChar = await CharactersCollection.findById(newLeaderCharId);
  if (!newLeaderChar) throw new Error('Character not found');

  if (
    !newLeaderChar.clan?.clanId ||
    newLeaderChar.clan.clanId.toString() !== clanId.toString()
  ) {
    throw new Error('Character does not belong to this clan');
  }

  const oldLeaderChar = await CharactersCollection.findById(clan.charId);
  if (!oldLeaderChar) throw new Error('Old leader character not found');

  if (oldLeaderChar._id.toString() === newLeaderChar._id.toString()) {
    throw new Error('Leader cannot transfer leadership to themselves');
  }
  oldLeaderChar.clan.role = 'member';
  await oldLeaderChar.save();

  newLeaderChar.clan.role = 'leader';
  await newLeaderChar.save();

  clan.leaderId = newLeaderChar.userId;
  clan.charId = newLeaderChar._id;
  clan.leaderCharNick = newLeaderChar.nickname;
  await clan.save();

  return { clan, newLeaderChar, oldLeaderChar };
}
