import { Router } from 'express';
import { check } from 'express-validator';

import { authenticateToken } from '../middleware/authenticateMiddleware';
import {
  createLandController,
  getLandController,
  getLandsController,
  getLandsForForm,
  updateLandController,
  getFarmersLandController,
} from '../controllers/LandController';

const router = Router();

router.post(
  '/create',
  [
    check('farmerID').notEmpty().isMongoId(),
    check('landAddress').notEmpty(),
    check('landUPI').notEmpty(),
    check('sizeInAcre').notEmpty().isNumeric(),
  ],
  authenticateToken,
  createLandController
);
router.get('/lands', authenticateToken, getLandsController);
router.get('/get-land', authenticateToken, getLandsForForm);
router.get(
  '/land',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  getLandController
);
router.put(
  '/update',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  updateLandController
);
router.get(
  '/farmer-land',
  [check('farmerID').notEmpty().isMongoId()],
  authenticateToken,
  getFarmersLandController
);

export { router as landRoutes };
