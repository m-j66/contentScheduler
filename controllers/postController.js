const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const { postService } = require("../services");

const handleCreatePost = catchAsync(async (req, res) => {
  const postData = {
    ...req.body,
    createdBy: req.user._id,
  };
  const post = await postService.createPost(postData);
  res.status(httpStatus.CREATED).json({ message: "Post created", post });
});

const handlegetPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  res.status(httpStatus.OK).json({ post });
});

const handlegetPaginatedPosts = catchAsync(async (req, res) => {
  let { page, limit, status } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  const filter = {};
  if (status) filter.status = status;

  const postsData = await postService.getPosts(filter, page, limit);

  res.status(httpStatus.OK).json({
    message: "Posts fetched successfully",
    ...postsData,
  });
});

const handleUpdatePost = catchAsync(async (req, res) => {
  const updatedPost = await postService.updatePost(
    req.params.postId,
    req.body,
    req.user._id
  );
  res
    .status(httpStatus.OK)
    .json({ message: "Post updated", post: updatedPost });
});

const handleDeletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user._id);
  res.status(httpStatus.OK).json({ message: "Post deleted successfully" });
});

module.exports = {
  handleCreatePost,
  handlegetPostById,
  handlegetPaginatedPosts,
  handleUpdatePost,
  handleDeletePost,
};
