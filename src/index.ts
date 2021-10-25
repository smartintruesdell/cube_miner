/* istanbul ignore file */
/**
 * Main entry point for the Cube Miner service ExpressJS application
 *
 * Defines the ExpressJS `service` and instantiates an HTTPS server
 * to host it, along with logging and middleware configuration.
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@martin-truesdell.com>
 */
import 'cross-fetch/polyfill';
import fs = require('fs');
import https = require('https');
import express = require('express');
import * as Env from './lib/env';

import { router } from './router';
import { logger, requestLogger, errorLogger } from './logger';

// Define the ExpressJS Service ////////////////////////////////////////////////

/** Instantiate an Express HTTP Application */
const service = express();
service.use(express.urlencoded({ extended: false }));
service.use(express.json());

/** Request logging middleware before router */
service.use(requestLogger);

/** Add Router to handle requests */
service.use(router);

/** Error logging middleware after router */
service.use(errorLogger);

// Fire up the service /////////////////////////////////////////////////////////

Env.init();

const PORT = Env.get('PORT').unwrapOr('3000');
const KEY_PATH = Env.get('HTTPS_KEY_PATH').expect(
  'HTTPS Key Path was unavailable. Ensure that "HTTPS_KEY_PATH" is set in your environment configuration'
);
const CERT_PATH = Env.get('HTTPS_CERT_PATH').expect(
  'HTTPS Cert Path was unavailable. Ensure that "HTTPS_CERT_PATH" is set in your environment configuration'
);

const server = https
  .createServer(
    {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync(CERT_PATH),
    },
    service
  )
  .listen(PORT, () => {
    logger.info(`Server started on http://localhost:${PORT}`);
  });

// Event Handling //////////////////////////////////////////////////////////////

const close_gracefully = (callback: () => void) => async () => {
  logger.info('Received shutdown signal');

  server.close(callback);
};

const handle_exception = async (_err: Error, _origin: string) => {
  // Error logging is handled in middleware, so we'll just do the normal
  // shutdown handling
  close_gracefully(() => process.exit(1));
};

// Handle system kill/term by shutting down the server to free the port
process.on('uncaughtException', handle_exception);
process.once(
  'SIGINT',
  close_gracefully(() => process.exit(0))
);
process.once(
  'SIGTERM',
  close_gracefully(() => process.exit(0))
);
process.once(
  'SIGUSR2',
  close_gracefully(() => {
    process.kill(process.pid, 'SIGUSR2');
    process.exit(0);
  })
);
