const Joi = require("joi");

const register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      "string.empty": "Password is required.",
    }),
});

const login = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
});

module.exports = {
  register,
  login,
};
