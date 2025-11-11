const Joi = require("joi");

const createPost = Joi.object({
  content: Joi.string().max(500).required(),
  platforms: Joi.array()
    .items(Joi.string().valid("Twitter", "Facebook", "Instagram"))
    .min(1)
    .required(),
  schedule: Joi.alternatives()
    .try(
      Joi.date()
        .custom((value, helpers) => {
          const inputDate = new Date(value);
          const currentDate = new Date();

          if (inputDate <= new Date(currentDate.getTime() - 5000)) {
            return helpers.error("date.greater");
          }
          return value;
        })
        .messages({ "date.greater": "Schedule must be a future date" }),

      Joi.exist().valid(null)
    )
    .optional()

    .messages({
      "date.greater": "Schedule must be a future date",
    })
    .allow(null)
    .optional(),
  imageUrl: Joi.string().uri().allow("").optional(),
  status: Joi.string().valid("draft", "scheduled").optional(),
});

const updatePost = Joi.object({
  content: Joi.string().max(500).optional(),
  platforms: Joi.array()
    .items(Joi.string().valid("Twitter", "Facebook", "Instagram"))
    .min(1)
    .optional(),
  schedule: Joi.date()
    .greater("now")
    .optional()
    .messages({ "date.greater": "Schedule must be a future date" }),
  imageUrl: Joi.string().uri().allow("").optional(),
  status: Joi.string().valid("draft", "scheduled", "failed").optional(),
});

module.exports = {
  createPost,
  updatePost,
};
