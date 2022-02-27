import * as winston from 'winston';
import convict from '../config';

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  level: convict.get('loglevel'),
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: 'DD.MM.YYYY - HH:mm:ss.SSS',
    }),
    winston.format.splat(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `- [ ${timestamp} ] - [ ${level} ] ${message}`
    )
  ),
  transports: [new winston.transports.Console()],
});

export { logger };
