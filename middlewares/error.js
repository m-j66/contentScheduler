const ApiError = require("../utils/ApiError");

const errorConverter = (err, req, res, next) => {
  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500;
    const message =
      err.message && typeof err.message === "string"
        ? err.message
        : "Internal Server Error";

    err = new ApiError(statusCode, message);
  }
  next(err);
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    code: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { errorConverter, errorHandler };
