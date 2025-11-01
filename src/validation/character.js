import Joi from 'joi';

export const characterSchema = Joi.object({
  server: Joi.string().min(2).max(16).trim().required(),
  nickname: Joi.string().min(2).max(10).trim().required(),
  race: Joi.string().required(),
  level: Joi.number().integer().min(1).max(105).required(),
  avatar: Joi.string().uri().allow(null, ''),
});
