import crypto from 'crypto';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import { UserSession } from '../db/models/session.js';
import { sendMail } from '../utils/sendMail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import * as fs from 'node:fs';
import path from 'node:path';

const REQUEST_PASSWORD_RESET_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'request-password-reset.hbs'),
  'utf-8',
);

export async function registerUser(payload) {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const role = process.env.ADMIN_EMAIL === payload.email ? 'admin' : 'user';

  return await UsersCollection.create({
    username: payload.username,
    email: payload.email,
    password: hashedPassword,
    role,
    clanId: null,
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

  const session = await UserSession.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 3 * 60 * 60 * 1000),
  });

  return {
    session,
    user: {
      username: user.username,
      role: user.role,
      clanId: user.clanId,
    },
  };
}

export async function logoutUser(sessionId) {
  await UserSession.deleteOne({ _id: sessionId });
}

export async function resetPasswordMail(email) {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    return;
  }

  const token = jwt.sign(
    {
      sub: user._id,
      user: user.name,
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '10m' },
  );

  const template = Handlebars.compile(REQUEST_PASSWORD_RESET_TEMPLATE);
  const resetPasswordLink = `${getEnvVar('APP_DOMAIN')}/reset?token=${token}`;

  await sendMail({
    to: email,
    subject: 'Reset password',
    html: template({
      resetPasswordLink: resetPasswordLink,
    }),
  });
}

export async function resetPassword(token, password) {
  try {
    const decoded = jwt.verify(token, getEnvVar('JWT_SECRET'));
    const user = await UsersCollection.findById(decoded.sub);

    if (user === null) {
      throw createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  } catch {
    throw createHttpError.Unauthorized('Token is expired or invalid.');
  }
}
