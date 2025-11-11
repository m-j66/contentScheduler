const { Schema, model } = require("mongoose");

const postSchema = Schema(
  {
    content: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    platforms: {
      type: [String],
      required: true,
      enum: ["Twitter", "Facebook", "Instagram"],
    },
    schedule: { type: Date },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "scheduled", "published", "failed"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ createdBy: 1 }); // filter posts by user
postSchema.index({ status: 1 }); // filter by status
postSchema.index({ schedule: 1 });

postSchema.pre("save", function (next) {
  if (this.schedule <= new Date()) {
    return next(new Error("Schedule date & time must be in the future"));
  }

  next();
});

postSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.schedule && update.schedule <= new Date()) {
    return next(new Error("Schedule date & time must be in the future"));
  }

  if (update.platforms) {
    update.platforms = update.platforms.map(
      (p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
    );
  }

  next();
});

const Post = model("Post", postSchema);

module.exports = Post;
