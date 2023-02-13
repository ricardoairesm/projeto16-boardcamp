import Joi from 'joi';

const jogoSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().optional(),
  stockTotal: Joi.number().min(1).required(),
  pricePerDay: Joi.number().min(1).required(),
});

export default jogoSchema;