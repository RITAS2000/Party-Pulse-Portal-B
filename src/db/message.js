import { Schema, model } from 'mongoose';

const clanMessageSchema = new Schema(
  {
    text: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    clanId: { type: Schema.Types.ObjectId, ref: 'Clan', required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const MessagesCollection = model('Message', clanMessageSchema);
