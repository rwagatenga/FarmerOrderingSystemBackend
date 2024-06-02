import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import 'express-async-errors';

import { errorHandler } from './middleware/ErrorHandler';
import logger from './utils/logger';
import router from './routes/router';
import StatusCodeEmums from './enums/StatusCodeEnums';

const app: Application = express();

dotenv.config();
declare global {
  var __basedir: string;
}
global.__basedir = __dirname;

export const createApp = async () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  app.use((req: Request, _: Response, next: NextFunction) => {
    const requestMethod = req.method;
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    logger.info(`[ ${requestMethod} ] ${fullUrl}`);
    next();
  });

  app.use(router);

  app.get('/health', (_: Request, res: Response) =>
    res.status(StatusCodeEmums.OK).json({ status: 'healthy' })
  );

  app.all('*', async () => {
    throw logger.error('Route not Found');
  });

  app.use(errorHandler);

  return app;
};
