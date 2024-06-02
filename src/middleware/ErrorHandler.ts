import { NextFunction, Request, Response } from 'express';

import StatusCodeEmums from '../enums/StatusCodeEnums';
import { CustomError } from '../errors/CustomError';
import logger from '../utils/logger';
import ErrorModel from '../models/ErrorModel';

export const errorHandler = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  const newError = new ErrorModel(logger.log('error', err));
  await newError.save();
  res
    .status(StatusCodeEmums.BAD_REQUEST)
    .json(err)
    .send({
      errors: [{ message: 'Something went wrong' }],
    });
};
