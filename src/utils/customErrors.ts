export class ValidationError extends Error {
  constructor(public readonly fields: string[]) {
    super("Validation failed");
  }
}

export class BadRequestError extends ValidationError {
  constructor(msg: string) {
    super([msg]);
  }
}

export class AuthError extends Error {}
export class NotFoundError extends Error {}
export class ForbiddenError extends Error {}
export class UnprocessableError extends Error {}
