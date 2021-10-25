import { RequestHandler } from 'express';

export const cancel_draft_handler: RequestHandler = async (
  _req,
  _res,
  _next
) => {
  throw new Error('NYI');
};
