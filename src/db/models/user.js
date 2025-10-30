import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 16 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/,
      maxlength: 128,
    },
    password: { type: String, required: true, minlength: 8, maxlength: 64 },

    role: {
      type: String,
      enum: ['user', 'admin', 'clanLeader'],
      default: 'user',
    },
    clanId: { type: String, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UsersCollection = model('User', userSchema);
