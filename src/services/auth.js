import crypto from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { UserSession } from '../db/models/session.js';

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

export async function loginUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });

  if (user === null) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }
  const isPasswordMatch = await bcrypt.compare(
    payload.password.trim(),
    user.password,
  );

  if (isPasswordMatch !== true) {
    throw createHttpError.Unauthorized('Email or password is incorrect');
  }
  await UserSession.deleteOne({ userId: user._id });

  return UserSession.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 3 * 60 * 60 * 1000),
  });
}
