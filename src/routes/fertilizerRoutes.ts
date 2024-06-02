import { Router } from 'express';
import { check } from 'express-validator';

import { authenticateToken } from '../middleware/authenticateMiddleware';
import {
  createFertilizerController,
  getFertilizerController,
  getFertilizersController,
  getFertilizersForForm,
  updateFertilizerController,
} from '../controllers/FertilizerController';

const router = Router();

router.post(
  '/create',
  [
    check('name').notEmpty(),
    check('quantityAvailable').notEmpty(),
    check('maxQuantityPerAcre').notEmpty(),
    check('pricePerKg').isNumeric().notEmpty(),
    check('pricingId').optional(),
  ],
  authenticateToken,
  createFertilizerController
);
router.get('/fertilizers', authenticateToken, getFertilizersController);
router.get('/get-fertilizer', authenticateToken, getFertilizersForForm);
router.get(
  '/fertilizer',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  getFertilizerController
);
router.put(
  '/update',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  updateFertilizerController
);

export { router as fertilizerRoutes };
