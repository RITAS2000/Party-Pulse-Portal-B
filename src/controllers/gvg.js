import { CharactersCollection } from '../db/models/character.js';
import createGvg from '../services/gvg.js';

export async function gvgCreateController(req, res) {
  const userId = req.user.id;
  console.log('🚀 ~ gvgCreateController ~ userId:', userId);
  const { territory, enemy, type, date, time, clanId } = req.body;
  console.log('🚀 ~ gvgCreateController ~ body:', req.body);

  const chars = await CharactersCollection.find({
    userId,
    'clan.clanId': clanId,
  });

  const hasPermission = chars.some(
    (c) => c.clan?.role === 'leader' || c.clan?.role === 'officer',
  );

  if (!hasPermission) {
    return res.status(403).json({ message: 'No permission to create GvG' });
  }

  try {
    const newGvg = await createGvg({
      territory,
      enemy,
      attackOrDefense: type,
      date: new Date(date),
      time,
      clanId,
    });
    return res.status(201).json({ data: newGvg });
  } catch (err) {
    console.error('Create GvG error:', err);
    return res.status(500).json({ message: err.message });
  }
}
