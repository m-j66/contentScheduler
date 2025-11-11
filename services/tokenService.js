const jwt = require("jsonwebtoken");
const moment = require("moment");
const config = require("../config/config");
const Token = require("../models/token");

const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  console.log("Generating token with type:", type);
  console.log("Token type from config:", "access");
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  console.log("Token payload:", payload);
  const token = jwt.sign(payload, secret);
  console.log("Generated token:", token);
  return token;
};

const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  if (payload.type !== type) {
    throw new Error("Invalid token type");
  }
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new Error("Token not found");
  }
  return tokenDoc;
};

const generateAuthToken = async (user) => {
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    "minutes"
  );

  const accessToken = generateToken(user.id, accessTokenExpires, "access");

  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

const removeToken = async (refreshToken) => {
  await Token.findOneAndDelete({ token: refreshToken });
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthToken,
  removeToken,
};
