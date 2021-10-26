import { RequestHandler } from 'express';
import { logger } from '../../../logger';

export const list_drafts_handler: RequestHandler = async (_req, _res, next) => {
  logger.info('list_drafts_handler called');
  next(new Error('NYI'));
};
