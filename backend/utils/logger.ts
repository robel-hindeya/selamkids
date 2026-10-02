type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'accessToken',
  'refreshToken',
  'serviceRoleKey',
  'apiKey',
  'secret',
  'authorization',
]);

function sanitize(data: unknown): unknown {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitize);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export const logger = {
  info(message: string, context?: Record<string, unknown>) {
    console.log(
      JSON.stringify({
        level: 'info' as LogLevel,
        timestamp: new Date().toISOString(),
        message,
        ...(context ? { context: sanitize(context) } : {}),
      })
    );
  },

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(
      JSON.stringify({
        level: 'warn' as LogLevel,
        timestamp: new Date().toISOString(),
        message,
        ...(context ? { context: sanitize(context) } : {}),
      })
    );
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(
      JSON.stringify({
        level: 'error' as LogLevel,
        timestamp: new Date().toISOString(),
        message,
        error:
          error instanceof Error
            ? { name: error.name, message: error.message, stack: error.stack }
            : error,
        ...(context ? { context: sanitize(context) } : {}),
      })
    );
  },

  debug(message: string, context?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(
        JSON.stringify({
          level: 'debug' as LogLevel,
          timestamp: new Date().toISOString(),
          message,
          ...(context ? { context: sanitize(context) } : {}),
        })
      );
    }
  },
};
