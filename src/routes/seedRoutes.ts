import { Router } from 'express';
import { check } from 'express-validator';

import { authenticateToken } from '../middleware/authenticateMiddleware';
import {
  createSeedController,
  getSeedController,
  getSeedsController,
  getSeedsForForm,
  updateSeedController,
} from '../controllers/SeedController';

const router = Router();

router.post('/create', authenticateToken, createSeedController);
router.get('/seeds', authenticateToken, getSeedsController);
router.get('/get-seeds', authenticateToken, getSeedsForForm);
router.get(
  '/seed',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  getSeedController
);
router.put(
  '/update',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  updateSeedController
);

export { router as seedRoutes };
