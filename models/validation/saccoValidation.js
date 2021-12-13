const { number } = require("joi");
const Joi = require("joi");
const joiPhoneNumber = Joi.extend(require("joi-phone-number"));

exports.registerValidation = async (data) => {
  const regSchema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).required(),
    contactPerson: Joi.string().required(),
    contactDigits: joiPhoneNumber
      .string()
      .phoneNumber({ defaultCountry: "KE", format: "national" })
      .required(),
    routedRegistration: Joi.number(),
    routes: Joi.array(),
    routeNumber: Joi.number(),
    start: Joi.string(),
    end: Joi.string(),
    normalFare: Joi.string(),
    rushHourFare: Joi.string(),
  });
  return await regSchema.validate(data);
};
exports.loginValidation = (data) => {
  //validation is using the email of the sacco as username will be less formal
  const loginSchema = Joi.object({
    email: Joi.string().min(7).required().email(),
    password: Joi.string().min(6).required(),
  });
  return loginSchema.validate(data);
};
