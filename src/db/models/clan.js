import { model, Schema } from 'mongoose';

const ClanSchema = new Schema(
  {
    clanName: { type: String, required: true },
    server: { type: String, required: true },
    logo: { type: String },
    leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    charId: { type: Schema.Types.ObjectId, ref: 'Character', required: true },
    leaderCharNick: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    clanChars: [{ type: Schema.Types.ObjectId, ref: 'Characterer' }],
    clanColor: { type: String, default: 'red' },
    message: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ClansCollection = model('Clan', ClanSchema);
