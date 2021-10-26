import { Router } from 'express';
import { DraftRoutes } from './v1/draft';
// import { UserRoutes } from './v1/user';

export const router = Router({
  caseSensitive: true,
  mergeParams: true,
});

router.use('/api/v1/draft', DraftRoutes);
// router.use('/api/v1/user', UserRoutes);

router.get('/health', async (_req, res, _next) => {
  res.status(200);
  res.end();
});
