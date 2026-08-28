class HttpError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.status = statusCode;
  }
}

module.exports = { HttpError };
