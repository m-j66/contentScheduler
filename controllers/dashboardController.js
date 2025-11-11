const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const { postService } = require("../services");

const handleDashboardStats = catchAsync(async (req, res) => {
  const stats = await postService.getDashboardStats(req.user._id);
  res.status(httpStatus.OK).json({ stats });
});

const handleUpcomingPosts = catchAsync(async (req, res) => {
  const posts = await postService.getUpcomingPosts(req.user._id);
  res.status(httpStatus.OK).json({ upcomingPosts: posts });
});

module.exports = {
  handleDashboardStats,
  handleUpcomingPosts,
};
