import { model, Schema } from 'mongoose';

const ClanSchema = new Schema(
  {
    clanName: { type: String, required: true },
    server: { type: String, required: true },
    logo: { type: String },
    leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    clanColor: { type: String, default: 'red' },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ClansCollection = model('Clan', ClanSchema);
