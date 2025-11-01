import { UsersCollection } from '../db/models/user.js';
import { CharactersCollection } from '../db/models/character.js';

export const getStats = async (req, res) => {
  try {
    const [usersCount, charsCount] = await Promise.all([
      UsersCollection.countDocuments(),
      CharactersCollection.countDocuments(),
    ]);

    res.status(200).json({ usersCount, charsCount });
  } catch (err) {
    console.error('❌ Stats error:', err);
    res.status(500).json({ message: 'Failed to load stats' });
  }
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
