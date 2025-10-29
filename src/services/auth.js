import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    role: 'user',
    clanId: null,
    isAdmin: process.env.ADMIN_EMAIL === payload.email,
  });
}
