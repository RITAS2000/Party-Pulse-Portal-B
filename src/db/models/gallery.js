import { model, Schema } from 'mongoose';

const galleryCharacterSchema = new Schema(
  {
    originalCharId: {
      type: Schema.Types.ObjectId,
      ref: 'Character',
      required: true,
    },

    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    nickname: { type: String, required: true },
    race: {
      type: String,
      required: true,
    },
    level: { type: Number, required: true },
    avatar: { type: String },
    server: { type: String },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const GalleryCharacters = model(
  'GalleryCharacter',
  galleryCharacterSchema,
);
