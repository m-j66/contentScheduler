const express = require("express");
const authRoute = require("./auth");
const postRoute = require("./post");
const dashboardRoute = require("./dashboard");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
