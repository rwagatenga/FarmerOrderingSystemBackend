import { Router } from 'express';
import { check } from 'express-validator';

import { authenticateToken } from '../middleware/authenticateMiddleware';
import {
  createPricingController,
  getPricingController,
  getPricingsController,
  getPricingsForForm,
  updatePricingController,
  getProductPriceController,
} from '../controllers/PricingController';

const router = Router();

router.post(
  '/create',
  [check('pricePerKg').notEmpty(), check('productID').optional().isMongoId()],
  authenticateToken,
  createPricingController
);
router.get('/pricings', authenticateToken, getPricingsController);
router.get('/get-pricing', authenticateToken, getPricingsForForm);
router.get(
  '/pricing',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  getPricingController
);
router.put(
  '/update',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  updatePricingController
);
router.get(
  '/product-price',
  [check('productID').notEmpty().isMongoId()],
  authenticateToken,
  getProductPriceController
);

export { router as pricingRoutes };
