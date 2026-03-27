class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

class UnauthorizedError extends HttpError {
  constructor(msg = "unauthorized") {
    super(401, msg);
  }
}

module.exports = { HttpError, UnauthorizedError };
