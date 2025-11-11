const httpStatus = require("http-status");
const Post = require("../models/post");
const ApiError = require("../utils/ApiError");

const createPost = async (postData) => {
  if (postData.schedule && new Date(postData.schedule) > new Date()) {
    postData.status = "scheduled";
  } else {
    postData.status = postData.status || "draft";
  }

  const post = await Post.create(postData);
  return post;
};

const getPostById = async (postId) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  return post;
};

const getPosts = async (filter = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [docs, totalDocs] = await Promise.all([
    Post.find(filter).sort({ schedule: 1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    docs,
    totalDocs,
    totalPages,
    currentPage: page,
    pageSize: docs.length,
  };
};

const updatePost = async (postId, updateData, userId) => {
  const post = await getPostById(postId);

  if (post.createdBy.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot edit this post");
  }

  if (post.status === "published") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Cannot edit published post");
  }

  Object.assign(post, updateData);
  await post.save();
  return post;
};

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  if (post.createdBy.toString() !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, "You cannot delete this post");
  }

  await post.deleteOne();

  return { message: "Post deleted successfully" };
};

const getUpcomingPosts = async (userId, limit = 5) => {
  const now = new Date();
  const posts = await Post.find({
    createdBy: userId,
    status: "scheduled",
    schedule: { $gt: now },
  })
    .sort({ schedule: 1 })
    .limit(limit)
    .lean();

  return posts;
};

const getDashboardStats = async (userId) => {
  const totalPosts = await Post.countDocuments({ createdBy: userId });
  const draft = await Post.countDocuments({
    createdBy: userId,
    status: "draft",
  });
  const scheduled = await Post.countDocuments({
    createdBy: userId,
    status: "scheduled",
  });
  const published = await Post.countDocuments({
    createdBy: userId,
    status: "published",
  });
  const failed = await Post.countDocuments({
    createdBy: userId,
    status: "failed",
  });

  return { totalPosts, draft, scheduled, published, failed };
};
module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getUpcomingPosts,
  getDashboardStats,
};
