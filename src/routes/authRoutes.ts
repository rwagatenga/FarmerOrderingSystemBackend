import { Router } from 'express';
import { check } from 'express-validator';

import {
  generateNewAccessToken,
  userLoginController,
  userLogoutController,
} from '../controllers/AuthController';
import { authenticateToken } from '../middleware/authenticateMiddleware';

const router = Router();

router.post(
  '/login',
  [check('email').isEmail().notEmpty(), check('password').notEmpty()],
  userLoginController
);

router.post('/logout', authenticateToken, userLogoutController);

router.post(
  '/token/refresh',
  authenticateToken,
  [check('refreshToken').notEmpty()],
  generateNewAccessToken
);

export { router as authRouter };
