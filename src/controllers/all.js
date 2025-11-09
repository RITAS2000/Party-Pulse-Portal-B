import { UsersCollection } from '../db/models/user.js';
import { CharactersCollection } from '../db/models/character.js';
import { ClansCollection } from '../db/models/clan.js';

export const getStats = async (req, res) => {
  const [usersCount, charsCount, clansCount] = await Promise.all([
    UsersCollection.countDocuments(),
    CharactersCollection.countDocuments(),
    ClansCollection.countDocuments(),
  ]);

  res.status(200).json({ usersCount, charsCount, clansCount });

  res.status(500).json({ message: 'Failed to load stats' });
};

export const updateCharacterLevel = async (req, res) => {
  const { level } = req.body;
  const { id } = req.params;

  try {
    const updatedChar = await CharactersCollection.findByIdAndUpdate(
      id,
      { level },
      { new: true },
    );
    res.status(200).json(updatedChar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
