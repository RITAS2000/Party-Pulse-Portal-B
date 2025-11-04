import Joi from 'joi';

export const clanValidationSchema = Joi.object({
  clanName: Joi.string().min(2).max(20).required(),
  server: Joi.string().min(2).max(16).required(),
  logo: Joi.string().uri().allow(null, ''),
  leaderId: Joi.string().hex().length(24).optional(),
  charId: Joi.string().hex().length(24).required(),
  leaderCharNick: Joi.string().min(2).max(10).required(),
  createdBy: Joi.string().hex().length(24).optional(),
  members: Joi.array().items(Joi.string().hex().length(24)),
  clanChars: Joi.array().items(Joi.string().hex().length(24)),
  clanColor: Joi.string()
    .valid(
      'red',
      'blue',
      'green',
      'yellow',
      'purple',
      'orange',
      'gray',
      'pink',
      'teal',
      'indigo',
    )
    .default('red'),
});
