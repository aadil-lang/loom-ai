export class BaseCustomError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, BaseCustomError.prototype);
  }
}

export class NotFoundError extends BaseCustomError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

export class ValidationError extends BaseCustomError {
  constructor(message = 'Validation failed') {
    super(message, 400);
  }
}

export class UnauthorizedError extends BaseCustomError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

export class ForbiddenError extends BaseCustomError {
  constructor(message = 'Forbidden') {
    super(message, 403);
  }
}

export class ConflictError extends BaseCustomError {
  constructor(message = 'Resource conflict') {
    super(message, 409);
  }
}
