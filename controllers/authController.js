const httpStatus = require("http-status").default;
const catchAsync = require("../utils/catchAsync");
const { authService, tokenService } = require("../services");

const handleRegisterUser = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  res.status(httpStatus.CREATED).send({ user });
});

const handleLogin = catchAsync(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthToken(user);
  res.send({ user, token: tokens.token });
});

const logout = catchAsync(async (req, res) => {
  await tokenService.removeToken(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  handleRegisterUser,
  handleLogin,
  logout,
};
