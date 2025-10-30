import {
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  resetPasswordMail,
} from '../services/auth.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const result = await loginUser({
    email: req.body.email,
    password: req.body.password,
  });
  const sessionId = result.session._id;
  res.cookie('session_id', sessionId, {
    httpOnly: true,
    expires: result.session.accessTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: result.session.accessToken,
      expiresIn: result.session.accessTokenValidUntil,
      userData: result.user,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (typeof sessionId !== 'undefined') {
    await logoutUser(sessionId);

    res.clearCookie('session_id');
  }

  res.status(204).end();
};

export async function SendResetEmailController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: 400,
        message: 'Email is required.',
      });
    }

    await resetPasswordMail(email);

    res.status(200).json({
      status: 200,
      message: 'If this email is registered, a reset link has been sent.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;

  await resetPassword(token, password);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}
