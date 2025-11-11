const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/authValidations");
const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/register",
  validate(authValidation.register),
  authController.handleRegisterUser
);

router.post(
  "/login",
  validate(authValidation.login),
  authController.handleLogin
);

router.post("/logout", authController.logout);

module.exports = router;
