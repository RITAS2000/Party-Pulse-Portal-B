import { CharactersCollection } from '../db/models/character.js';
import { ClansCollection } from '../db/models/clan.js';
import { UsersCollection } from '../db/models/user.js';
import {
  addOfficer,
  createClan,
  deleteClan,
  getAllClans,
  getClanMessage,
  removeOfficer,
  setClanMessage,
  transferLeadership,
} from '../services/clan.js';
import { uploadToCloudinary } from '../utils/uploadCloudinary.js';
import * as fs from 'node:fs/promises';

export async function addClansController(req, res) {
  req.body.leaderId = req.user.id;
  const result = req.file ? await uploadToCloudinary(req.file.path) : null;
  if (req.file) await fs.unlink(req.file.path);

  const { clanName, server, clanColor, charId, leaderCharNick, leaderId } =
    req.body;

  if (!clanName || !server) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const existingClan = await ClansCollection.findOne({
    charId,
    server,
  });
  if (existingClan) {
    return res.status(400).json({
      message: 'Character cannot be a leader of two clans on the same server',
    });
  }

  const character = await CharactersCollection.findById(charId);
  if (!character) {
    return res.status(404).json({ message: 'Character not found' });
  }
  if (character.clan && character.clan.clanId) {
    return res.status(400).json({
      message:
        'Character is already a member of a clan and cannot create a new one',
    });
  }
  if (character.server !== server) {
    return res.status(400).json({
      message: 'Character cannot create a clan on another server',
    });
  }

  const clanNameExists = await ClansCollection.findOne({
    clanName: { $regex: new RegExp(`^${clanName}$`, 'i') },
    server,
  });
  if (clanNameExists) {
    return res.status(400).json({
      message: 'A clan with this name already exists on this server',
    });
  }

  const clan = await createClan({
    clanName,
    server,
    clanColor,
    charId,
    leaderCharNick,
    logo: result.secure_url,
    leaderId,
    createdBy: leaderId,
    members: [leaderId],
    clanChars: [charId],
  });

  await UsersCollection.findByIdAndUpdate(leaderId, {
    $addToSet: { clansId: clan._id },
  });

  await CharactersCollection.findByIdAndUpdate(charId, {
    clan: {
      clanId: clan._id,
      role: 'leader',
      accepted: true,
    },
  });

  res.status(201).json({
    status: 201,
    message: 'Successfully created a clan!',
    clanData: clan,
  });

  res.status(500).json({ message: 'Server error' });
}

export async function getClansController(req, res) {
  const clans = await getAllClans();
  res.status(200).json(clans);
}

export async function deleteClanController(req, res) {
  const { clanId } = req.params;
  const userId = req.user.id;

  try {
    const clan = await ClansCollection.findById(clanId);

    if (!clan) {
      return res.status(404).json({ message: 'Clan not found' });
    }

    if (clan.clanChars && clan.clanChars.length > 1) {
      return res
        .status(400)
        .json({ message: 'Cannot delete clan with multiple characters' });
    }

    // ❌ Якщо користувач не лідер
    if (clan.leaderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Only the clan leader can delete this clan' });
    }

    const deletedClan = await deleteClan(clanId, userId);

    if (!deletedClan) {
      return res.status(403).json({ message: 'Failed to delete clan' });
    }

    return res.status(200).json({ message: 'Clan deleted successfully' });
  } catch (error) {
    console.error('Error deleting clan:', error);
    return res
      .status(500)
      .json({ message: 'Server error while deleting clan' });
  }
}

export async function getClanByIdController(req, res) {
  const { clanId } = req.params;

  const clan = await ClansCollection.findById(clanId);
  if (!clan) {
    return res.status(404).json({ message: 'Clan not found' });
  }

  res.status(200).json(clan);
}

export async function addCharToClanController(req, res) {
  const { charId, clanId } = req.body;

  const clan = await ClansCollection.findById(clanId);
  if (!clan) return res.status(404).json({ message: 'Clan not found' });

  if (clan.clanChars.includes(charId)) {
    return res.status(400).json({ message: 'Character already queued' });
  }

  const char = await CharactersCollection.findById(charId);
  if (!char) return res.status(404).json({ message: 'Character not found' });

  if (char.clan?.clanId) {
    return res
      .status(400)
      .json({ message: 'Character already belongs to a clan.' });
  }

  // Додаємо clanId в персонажа
  char.clan.clanId = clanId;
  await char.save();

  // // Додаємо персонажа в клановий масив очікування
  // await ClansCollection.findByIdAndUpdate(clanId, {
  //   $addToSet: { clanChars: charId },
  // });

  return res
    .status(200)
    .json({ message: 'Character added to clan. Waiting for acceptance.' });
}

//==================================================

export async function upsertMessageController(req, res) {
  const { clanId, message } = req.body;

  const updatedMessage = await setClanMessage(clanId, message);
  res.status(200).json({ message: updatedMessage });
}

export async function getClanMessageController(req, res) {
  const { clanId } = req.params;

  if (!clanId) return res.status(400).json({ message: 'clanId is required' });

  const message = await getClanMessage(clanId);
  if (message === null)
    return res.status(404).json({ message: 'Message not found' });
  res.status(200).json({ message });
}

export async function acceptCharToClanController(req, res) {
  const userId = req.user.id;
  const { clanId, charId } = req.body;

  if (!clanId || !charId) {
    return res.status(400).json({ error: 'Missing charId or clanId' });
  }
  const clan = await ClansCollection.findById(clanId);
  if (!clan) {
    return res.status(404).json({ error: 'Clan not found' });
  }

  if (clan.leaderId.toString() !== userId.toString()) {
    return res
      .status(403)
      .json({ error: 'Only clan leader can accept characters' });
  }
  await ClansCollection.findByIdAndUpdate(clanId, {
    $addToSet: { clanChars: charId },
  });

  const char = await CharactersCollection.findById(charId);
  char.clan.accepted = true;

  await char.save();

  const user = await UsersCollection.findById(userId);
  if (!user) return;

  user.clansId = user.clansId || [];
  if (!user.clansId.includes(clanId)) {
    user.clansId.push(clanId);
    await user.save();
  }
  return res.status(200).json({ message: 'Character is accepted' });
}

export async function notAcceptCharToClanController(req, res) {
  const userId = req.user.id;
  const { charId, clanId } = req.body;

  if (!charId) {
    return res.status(400).json({ error: 'Missing charId' });
  }

  const char = await CharactersCollection.findById(charId);
  if (!char) {
    return res.status(404).json({ error: 'Character not found' });
  }
  const clan = await ClansCollection.findById(clanId);
  if (clan.charId.toString() === charId.toString()) {
    return res.status(400).json({ error: 'Cannot remove leader character' });
  }
  if (
    char.userId.toString() !== userId.toString() &&
    clan.leaderId.toString() !== userId.toString()
  ) {
    return res.status(403).json({ error: 'No permission' });
  }

  char.clan = { clanId: null, role: 'member', accepted: false };
  await char.save();
  await ClansCollection.findByIdAndUpdate(clanId, {
    $pull: { clanChars: char._id },
  });

  return res.status(200).json({ message: 'Character request canceled' });
}

export async function addOfficerController(req, res) {
  try {
    const userId = req.user.id;
    const { charId, clanId } = req.body;

    if (!charId || !clanId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await addOfficer({ userId, charId, clanId });

    return res.status(result.status).json({
      message: result.message,
      updatedChar: result.updatedChar,
    });
  } catch (error) {
    console.error('Error in addOfficerController:', error);
    return res
      .status(500)
      .json({ message: 'Server error while assigning officer' });
  }
}

export async function removeOfficerController(req, res) {
  try {
    const userId = req.user.id;
    const { charId, clanId } = req.body;

    const updatedChar = await removeOfficer({ userId, charId, clanId });

    return res.status(200).json({
      message: 'Officer removed successfully',
      char: updatedChar,
    });
  } catch (error) {
    console.error('Error in removeOfficerController:', error);

    return res.status(error.status || 500).json({
      message: error.message || 'Server error while removing officer',
    });
  }
}

export async function transferLeadershipController(req, res) {
  try {
    const userId = req.user.id;
    const { clanId, newLeaderCharId } = req.body;

    const result = await transferLeadership(clanId, newLeaderCharId, userId);

    return res.status(200).json({
      message: 'Leadership successfully transferred',
      clan: result.clan,
      newLeaderChar: result.newLeaderChar,
      oldLeaderChar: result.oldLeaderChar,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
