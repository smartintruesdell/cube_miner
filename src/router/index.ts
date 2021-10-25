import { Router } from 'express';
// import { DraftRoutes } from './draft';
// import { UserRoutes } from './user';

export const router = Router({
  caseSensitive: true,
  mergeParams: true,
});

// router.use('/api/v1/draft', DraftRoutes);
// router.use('/api/v1/user', UserRoutes);
