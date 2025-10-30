import nodemailer from 'nodemailer';
import { getEnvVar } from '../utils/getEnvVar.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: getEnvVar('SMTP_HOST'),
  port: Number(getEnvVar('SMTP_PORT')),
  secure: true,
  auth: {
    user: getEnvVar('SMTP_USER'),
    pass: getEnvVar('SMTP_PASSWORD'),
  },
});

export async function sendMail(mail) {
  try {
    mail.from = getEnvVar('SMTP_FROM');
    return await transporter.sendMail(mail);
  } catch {
    throw createHttpError.InternalServerError(
      'Failed to send the email, please try again later.',
    );
  }
}
