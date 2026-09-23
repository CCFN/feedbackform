export class HttpException extends Error {
  constructor(status, message, errors = null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', errors = null) {
    super(400, message, errors);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized access') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'Access forbidden') {
    super(403, message);
  }
}
