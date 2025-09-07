import { ApplicationLogs } from '../database/models';

export class Logger {
  static info(message: string) {
    ApplicationLogs.create({
      message,
      severity: 'info',
      timestamp: new Date(),
    });
  }

  static warning(message: string) {
    ApplicationLogs.create({
      message,
      severity: 'warning',
      timestamp: new Date(),
    });
  }

  static error(
    message: string,
    stack?: string,
    statusCode?: number,
    method?: string,
    route?: string
  ) {
    ApplicationLogs.create({
      message,
      severity: 'error',
      stack,
      statusCode,
      method,
      route,
      timestamp: new Date(),
    });
  }
}
