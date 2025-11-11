const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

router.get("/stats", auth, dashboardController.handleDashboardStats);
router.get("/upcoming", auth, dashboardController.handleUpcomingPosts);

module.exports = router;
