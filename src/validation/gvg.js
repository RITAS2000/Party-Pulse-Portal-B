import Joi from 'joi';

export const gvgValidationSchema = Joi.object({
  territory: Joi.string().required(),
  enemy: Joi.string().min(2).max(10).required(),
  type: Joi.string().valid('attack', 'defense').required(),
  date: Joi.date().required(),
  time: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required(),
  clanId: Joi.string().required(),
});
