import { UsersCollection } from '../db/models/user.js';
import { createClan, getAllClans } from '../services/clan.js';
import { uploadToCloudinary } from '../utils/uploadCloudinary.js';
import * as fs from 'node:fs/promises';

export async function addClansController(req, res) {
  try {
    const result = req.file ? await uploadToCloudinary(req.file.path) : null;
    if (req.file) await fs.unlink(req.file.path);

    const { clanName, server, clanColor } = req.body;
    const userId = req.user.id;

    if (!clanName || !server) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const clan = await createClan({
      clanName,
      server,
      clanColor,
      logo: result.secure_url,
      leaderId: userId,
      createdBy: userId,
      members: [userId],
    });

    await UsersCollection.findByIdAndUpdate(userId, {
      clanId: clan._id,
      clanRole: 'leader',
    });

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
