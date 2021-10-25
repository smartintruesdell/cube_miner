import dotenv = require('dotenv');
import winston = require('winston');
import expressWinston = require('express-winston');

dotenv.config();

/** Formatters define the 'shape' of loglines */
const formatters = {
  json: winston.format.combine(
    // We want all log lines to include an ISO timestamp for analytics
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    // And complete JSON formatted messages for easy data manipulation
    winston.format.json()
  ),
};

/** Transports define how log events get processed */
const transports = {
  // The `Console` transport sends log messages to the console.
  console: new winston.transports.Console({
    // But it is `silent` in Production, so we don't impact performance.
    silent: process.env.NODE_ENV === 'production',
    level: 'debug',
  }),
  // The `File` transport logs to a file, and automatically rolls to
  // new files when the filesize hits some threshold.
  file: new winston.transports.File({
    // Setting the level to `info` here means the log file won't include
    // `debug` level messages, but everything else should appear.
    level: 'info',
    filename: process.env.SERVICE_LOGFILE || 'service.log',
    tailable: true,
    zippedArchive: true,
  }),
};

/** This is the common logger used for logging from the source code */
export const logger = winston.createLogger({
  transports: [transports.console, transports.file],
  format: formatters.json,
});

/** This is the logger added as Express middleware to log incoming requests */
export const requestLogger = expressWinston.logger({
  transports: [transports.file],
  format: formatters.json,
  meta: true,
  msg: 'HTTP {{req.method}} {{req.url}}',
  expressFormat: true,
  colorize: false,
});

/** This is the logger added as Express middleware to log request errors */
export const errorLogger = expressWinston.errorLogger({
  transports: [transports.console, transports.file],
  format: formatters.json,
});

export default logger;
