import { AppError } from './app-error';

export class AuthError extends AppError {
  constructor(message = 'Authentication failed', statusCode = 401, code = 'UNAUTHORIZED', details?: unknown) {
    super(message, statusCode, code, true, details);
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'You must be logged in to access this resource') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AuthError {
  constructor(message = 'You do not have permission to perform this action.') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class InsufficientRoleError extends AuthError {
  constructor(requiredRole: string, actualRole?: string) {
    super(
      `Access denied. Requires role: ${requiredRole}. Your role: ${actualRole || 'none'}`,
      403,
      'INSUFFICIENT_ROLE'
    );
  }
}

export class InsufficientPermissionError extends AuthError {
  constructor(permission: string) {
    super(
      `Access denied. Missing required permission: ${permission}`,
      403,
      'INSUFFICIENT_PERMISSION'
    );
  }
}

export class SessionExpiredError extends AuthError {
  constructor(message = 'Your session has expired. Please log in again.') {
    super(message, 401, 'SESSION_EXPIRED');
  }
}
