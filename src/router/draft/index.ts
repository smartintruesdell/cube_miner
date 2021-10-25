/**
 * Router for Draft related request handling
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@martin-truesdell.com>
 */
import { Router } from 'express';
import { DraftPlayerRoutes } from './player';

import { list_drafts_handler } from './list_drafts';
import { new_draft_handler } from './new_draft';
import { get_draft_handler } from './get_draft';
import { broadcast_to_draft_handler } from './broadcast_to_draft';
import { cancel_draft_handler } from './cancel_draft';
import { get_draft_picks_handler } from './get_draft_picks';
import { start_draft_handler } from './start_draft';
import { subscribe_to_draft_handler } from './subscribe_to_draft';
import { unsubscribe_from_draft_handler } from './unsubscribe_from_draft';

export const DraftRoutes = Router({
  caseSensitive: true,
  mergeParams: true,
});

DraftRoutes.get('/list', list_drafts_handler);
DraftRoutes.get('/new', new_draft_handler);
DraftRoutes.get('/:draft_id', get_draft_handler);
DraftRoutes.get('/:draft_id/picks', get_draft_picks_handler);

DraftRoutes.post('/:draft_id/broadcast', broadcast_to_draft_handler);
DraftRoutes.post('/:draft_id/cancel', cancel_draft_handler);
DraftRoutes.post('/:draft_id/start', start_draft_handler);
DraftRoutes.post('/:draft_id/subscribe', subscribe_to_draft_handler);
DraftRoutes.post('/:draft_id/unsubscribe', unsubscribe_from_draft_handler);

DraftRoutes.use('/:draft_id/player', DraftPlayerRoutes);
