const Joi = require("joi");

const UserPayLoadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = { UserPayLoadSchema };
