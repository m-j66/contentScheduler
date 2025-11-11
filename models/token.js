const { Schema, model } = require("mongoose");

const tokenSchema = Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["access", "verifyEmail"],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Token = model("Token", tokenSchema);

module.exports = Token;
