const { number } = require("joi");
const Joi = require("joi");

exports.registerValidation = async (data) => {
  const regSchema = Joi.object({
    email: Joi.string().required().email(),
    username: Joi.string().max(255).required(),
    password: Joi.string().min(6).required(),
    phoneNumber: Joi.required(),
  });
  return await regSchema.validate(data);
};

exports.loginValidation = async (data) => {
  const loginSchema = Joi.object({
    username: Joi.string().max(255).required(),
    password: Joi.string().min(6).required(),
  });
  return await loginSchema.validate(data);
};

//for login, remember to use 2 factor authentication
