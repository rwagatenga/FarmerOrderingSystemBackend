import { Router } from 'express';
import { check, query } from 'express-validator';

import { authenticateToken } from '../middleware/authenticateMiddleware';
import {
  createOrderController,
  getOrdersController,
  updateOrderController,
} from '../controllers/OrderController';

const router = Router();

router.post(
  '/create',
  [
    check('farmerID').notEmpty().isMongoId(),
    check('landID').notEmpty().isMongoId(),
    check('fertilizerID').notEmpty().isMongoId(),
    check('seedID').notEmpty().isMongoId(),
    check('fertilizerQuantityOrdered').notEmpty().isNumeric(),
    check('seedQuantityOrdered').notEmpty().isNumeric(),
    check('status').notEmpty(),
    check('paymentStatus').notEmpty(),
    check('seedPricePerUnit').notEmpty(),
    check('seedTotalPrice').notEmpty(),
    check('fertilizerPricePerUnit').notEmpty(),
    check('fertilizerTotalPrice').notEmpty(),
  ],
  authenticateToken,
  createOrderController
);

router.get(
  '/orders',
  [query('farmerID').optional().isMongoId()],
  authenticateToken,
  getOrdersController
);

router.put(
  '/update',
  [query('id').notEmpty().isMongoId()],
  authenticateToken,
  updateOrderController
);
export { router as orderRoutes };
