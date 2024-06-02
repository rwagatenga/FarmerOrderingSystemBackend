import { Router } from 'express';
import { check } from 'express-validator';

import {
  createUserController,
  getFarmersController,
  getUserController,
  updateUserController,
} from '../controllers/UserController';
import { authenticateToken } from '../middleware/authenticateMiddleware';

const router = Router();

router.post(
  '/create',
  [
    check('name').notEmpty(),
    check('phone').notEmpty(),
    check('email').notEmpty(),
    check('password').optional(),
    check('category').isEmail().notEmpty(),
    check('address').optional(),
  ],
  createUserController
);

router.get('/users', authenticateToken, getFarmersController);
router.get('/user', authenticateToken, getUserController);
router.post(
  '/update',
  [check('id').notEmpty().isMongoId()],
  authenticateToken,
  updateUserController
);

export { router as userRoutes };
