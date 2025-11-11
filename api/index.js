const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");
const { jwtStrategy } = require("./config/passport");
const { errorConverter, errorHandler } = require("./middlewares/error");
const config = require("./config/config");
const routes = require("./routes");
const app = express();

mongoose.connect(config.mongoose.url, config.mongoose.options).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.use(
  cors({
    origin: "https://my-content-scheduler.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api/", routes);

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
