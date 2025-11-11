const httpStatus = require("http-status").default;
const User = require("../models/user");
const ApiError = require("../utils/ApiError");

const register = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  const user = await User.create(userBody);
  return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No User With This Email exists");
  }
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials");
  }

  return user;
};

module.exports = {
  register,
  loginUserWithEmailAndPassword,
};
