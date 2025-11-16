import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    gvgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Gvg',
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ['attack', 'center', 'defense'],
      required: true,
    },
    members: [
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

export const PartyCollections = mongoose.model('Party', partySchema);
