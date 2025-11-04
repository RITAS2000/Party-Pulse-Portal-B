import { model, Schema } from 'mongoose';

const characterSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 10,
    },
    race: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 105,
    },
    avatar: {
      type: String,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    server: {
      type: String,
      required: true,
    },
    clan: {
      clanId: {
        type: Schema.Types.ObjectId,
        ref: 'Clan',
        required: false,
      },
      role: {
        type: String,
        enum: ['leader', 'member'],
        default: 'member',
      },
      accepted: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const CharactersCollection = model('Character', characterSchema);
