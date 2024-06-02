import { createClient } from 'redis';
import 'dotenv/config';
import { promisify } from 'util';

import Logger from './logger';

export const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on('error', (error: Error) => {
  Logger.info(error);
});

redisClient.connect();

export const getAsync = promisify(redisClient.get).bind(redisClient);
export const setAsync = promisify(redisClient.set).bind(redisClient);
export const expireAsync = promisify(redisClient.expire).bind(redisClient);
export const delAsync = promisify(redisClient.del).bind(redisClient);
