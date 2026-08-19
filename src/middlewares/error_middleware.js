function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isUniqueViolation = error.code === "23505";
  const isForeignKeyViolation = error.code === "23503";
  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode
    : isUniqueViolation
      ? 409
      : isForeignKeyViolation
        ? 400
        : 500;
  return res.status(statusCode).json({
    success: false,
    message: isUniqueViolation
      ? "A record with these values already exists"
      : isForeignKeyViolation
        ? "A referenced record does not exist"
        : statusCode >= 500
          ? "Internal server error"
          : error.message || "Request failed",
  });
}

module.exports = errorMiddleware;
