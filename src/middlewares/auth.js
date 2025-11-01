import createHttpError from 'http-errors';
import { UserSession } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';

export async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }

  const [bearer, accessToken] = authorization.split(' ', 2);
  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    throw createHttpError.Unauthorized('Please provide access token');
  }
  const session = await UserSession.findOne({ accessToken });
  if (!session) {
    throw createHttpError.Unauthorized('Session not found');
  }
  if (session.accessTokenValidUntil < new Date()) {
    throw createHttpError.Unauthorized('Access token expired');
  }

  const user = await UsersCollection.findById(session.userId);
  if (!user) {
    throw createHttpError.Unauthorized('User not found');
  }

  req.user = { id: user._id, role: user.role };

  next();
}
