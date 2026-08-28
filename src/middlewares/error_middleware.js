function errorMiddleware(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const isUniqueViolation = error?.code === "23505";
  const isForeignKeyViolation = error?.code === "23503";
  const rawStatusCode = error?.statusCode || error?.status;

  let statusCode = Number.isInteger(rawStatusCode)
    ? rawStatusCode
    : isUniqueViolation
      ? 409
      : isForeignKeyViolation
        ? 400
        : 500;

  let message;
  if (isUniqueViolation) {
    const detail = (error.detail || error.message || "").toLowerCase();
    const constraint = (error.constraint || "").toLowerCase();
    if (detail.includes("email") || constraint.includes("email")) {
      message = "Email already exists";
    } else if (detail.includes("username") || constraint.includes("username")) {
      message = "Username already exists";
    } else {
      message = "A record with these values already exists";
    }
  } else if (isForeignKeyViolation) {
    message = "A referenced record does not exist";
  } else if (statusCode >= 500) {
    message = "Internal server error";
  } else {
    message = error?.message || "Request failed";
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorMiddleware;

