type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    // Always log to console in development
    if (this.isDevelopment) {
      console[level](`[${entry.timestamp}] ${message}`, context || '');
    }

    // In production, you might want to send to external service
    if (this.isProduction) {
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry) {
    // Example: Send to external logging service
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // }).catch(console.error);
    
    // For now, just log to console in production too
    console[entry.level](`[${entry.timestamp}] ${entry.message}`, entry.context || '');
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  // API specific logging
  apiRequest(method: string, url: string, context?: Record<string, unknown>) {
    this.info(`API Request: ${method} ${url}`, context);
  }

  apiResponse(method: string, url: string, status: number, context?: Record<string, unknown>) {
    const level = status >= 400 ? 'error' : 'info';
    this[level](`API Response: ${method} ${url} - ${status}`, context);
  }

  // User action logging
  userAction(action: string, context?: Record<string, unknown>) {
    this.info(`User Action: ${action}`, context);
  }

  // Error logging with stack trace
  errorWithStack(message: string, error: Error, context?: Record<string, unknown>) {
    this.error(message, {
      ...context,
      stack: error.stack,
      name: error.name,
    });
  }
}

export const logger = new Logger();
