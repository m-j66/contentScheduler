const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const postValidation = require("../validations/postValidation");
const postController = require("../controllers/postController");

router.post(
  "/create",
  auth,
  validate(postValidation.createPost),
  postController.handleCreatePost
);

router.get("/:postId", auth, postController.handlegetPostById);

router.get("/", auth, postController.handlegetPaginatedPosts);

router.put(
  "/:postId",
  auth,
  validate(postValidation.updatePost),
  postController.handleUpdatePost
);

router.delete("/:postId", auth, postController.handleDeletePost);

module.exports = router;
