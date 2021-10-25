import { Router } from 'express';

import { add_draft_player_handler } from './add_draft_player';
import { dequeue_player_draft_pick_handler } from './dequeue_player_draft_pick';
import { enqueue_player_draft_pick_handler } from './enqueue_player_draft_pick';
import { get_draft_player_handler } from './get_draft_player';
import { get_player_draft_picks_handler } from './get_player_draft_picks';
import { list_draft_players_handler } from './list_draft_players';
import { notify_draft_player_handler } from './notify_draft_player';
import { remove_draft_player_handler } from './remove_draft_player';

export const DraftPlayerRoutes = Router({
  caseSensitive: true,
  mergeParams: true,
});

DraftPlayerRoutes.get('/list', list_draft_players_handler);
DraftPlayerRoutes.get('/:player_id/', get_draft_player_handler);
DraftPlayerRoutes.get('/:player_id/picks', get_player_draft_picks_handler);

DraftPlayerRoutes.post('/add', add_draft_player_handler);
DraftPlayerRoutes.post('/:player_id/notify', notify_draft_player_handler);
DraftPlayerRoutes.post('/:player_id/remove', remove_draft_player_handler);
DraftPlayerRoutes.post(
  '/:player_id/picks/enqueue',
  enqueue_player_draft_pick_handler
);
DraftPlayerRoutes.post(
  '/:player_id/picks/:pick_id/dequeue',
  dequeue_player_draft_pick_handler
);
