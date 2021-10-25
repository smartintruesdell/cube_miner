require('cross-fetch/polyfill');

// Enable fetch mocking
require('jest-fetch-mock').enableMocks();

// Disable winston logging for unit tests.
const logger = require('./src/logger').logger;
logger.transports.forEach((t) => (t.silent = true));
