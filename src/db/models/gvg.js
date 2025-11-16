import mongoose from 'mongoose';

const gvgSchema = new mongoose.Schema(
  {
    clanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Clan',
      required: true,
    },
    territory: {
      type: String,
      required: true,
    },
    enemy: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    attackOrDefense: {
      type: String,
      enum: ['attack', 'defense'],
      required: true,
    },
    safeZone: [
      {
        characterId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Character',
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GvgCollections = mongoose.model('GvG', gvgSchema);
