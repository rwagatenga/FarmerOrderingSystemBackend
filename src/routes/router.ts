import express from 'express';

import { userRoutes } from './userRoutes';
import { authRouter } from './authRoutes';
import { fertilizerRoutes } from './fertilizerRoutes';
import { landRoutes } from './landRoutes';
import { pricingRoutes } from './pricingRoutes';
import { seedRoutes } from './seedRoutes';
import { orderRoutes } from './orderRoutes';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRoutes);
router.use('/fertilizer', fertilizerRoutes);
router.use('/land', landRoutes);
router.use('/pricing', pricingRoutes);
router.use('/seed', seedRoutes);
router.use('/order', orderRoutes);

export default router;
