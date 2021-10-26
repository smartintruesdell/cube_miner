/**
 * Router for User related request handling
 *
 * @authors
 *   Shawn Martin-Truesdell <shawn@martin-truesdell.com>
 */
import { Router } from 'express';

import { get_user_handler } from './get_user';
import { get_user_drafts_handler } from './get_user_drafts';
import { get_user_preferences_handler } from './get_user_preferences';
import { list_users_handler } from './list_users';
import { new_user_handler } from './new_user';

export const UserRoutes = Router({
  caseSensitive: true,
  mergeParams: true,
});

UserRoutes.get('/list', list_users_handler);
UserRoutes.get('/:user_id', get_user_handler);
UserRoutes.get('/:user_id/drafts', get_user_drafts_handler);
UserRoutes.get('/:user_id/preferences', get_user_preferences_handler);

UserRoutes.post('/new', new_user_handler);
