import { CharactersCollection } from '../db/models/character.js';
import { ClansCollection } from '../db/models/clan.js';
import { UsersCollection } from '../db/models/user.js';
import { createClan, deleteClan, getAllClans } from '../services/clan.js';
import { uploadToCloudinary } from '../utils/uploadCloudinary.js';
import * as fs from 'node:fs/promises';

export async function addClansController(req, res) {
  try {
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

    await UsersCollection.findByIdAndUpdate(leaderId, { clansId: clan._id });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a clan!',
      clanData: clan,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getClansController(req, res) {
  const clans = await getAllClans();
  res.status(200).json(clans);
}

export async function deleteClanController(req, res) {
  const { clanId } = req.params;
  const userId = req.user.id;

  const clan = await deleteClan(clanId, userId);

  if (!clan) {
    return res
      .status(403)
      .json({ message: 'Only leader can delete this clan' });
  }
  res.status(204).end();
}
