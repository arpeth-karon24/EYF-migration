/**
 * Logging Utilities for Production Monitoring
 * Structured logging for Cloudflare Functions
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  endpoint?: string;
  clientIp?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

/**
 * Log a structured message
 */
export function log(
  level: LogLevel,
  message: string,
  context?: {
    endpoint?: string;
    clientIp?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
    data?: Record<string, unknown>;
    error?: Error | string;
  }
): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    endpoint: context?.endpoint,
    clientIp: context?.clientIp,
    method: context?.method,
    statusCode: context?.statusCode,
    duration: context?.duration,
    context: context?.data,
  };

  if (context?.error) {
    if (context.error instanceof Error) {
      entry.error = {
        message: context.error.message,
        stack: context.error.stack,
      };
    } else {
      entry.error = {
        message: String(context.error),
      };
    }
  }

  // Log to console (Cloudflare will capture this)
  const logMessage = JSON.stringify(entry);

  switch (level) {
    case 'debug':
      console.debug(logMessage);
      break;
    case 'info':
      console.info(logMessage);
      break;
    case 'warn':
      console.warn(logMessage);
      break;
    case 'error':
      console.error(logMessage);
      break;
  }
}

/**
 * Log form submission
 */
export function logSubmission(
  formType: string,
  email: string,
  success: boolean,
  context?: {
    clientIp?: string;
    duration?: number;
    errorMessage?: string;
  }
): void {
  log(success ? 'info' : 'warn', `Form submission: ${formType}`, {
    endpoint: `/api/${formType}`,
    clientIp: context?.clientIp,
    statusCode: success ? 200 : 400,
    duration: context?.duration,
    data: {
      formType,
      email: maskEmail(email),
      success,
      errorMessage: context?.errorMessage,
    },
  });
}

/**
 * Mask email for privacy in logs
 */
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) return 'invalid@email.com';

  const firstChar = localPart[0];
  const asterisks = '*'.repeat(Math.max(1, localPart.length - 1));
  return `${firstChar}${asterisks}@${domain}`;
}

/**
 * Create a performance timer
 */
export class Timer {
  private startTime: number;

  constructor() {
    this.startTime = Date.now();
  }

  /**
   * Get elapsed time in milliseconds
   */
  getElapsed(): number {
    return Date.now() - this.startTime;
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedSeconds(): number {
    return this.getElapsed() / 1000;
  }
}
