import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';

import StatusCodeEmums from '../enums/StatusCodeEnums';

import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import logger from '../utils/logger';
import {
  createFertilizer,
  findAllFertilizers,
  findFertilizerById,
  updateFertilizer,
} from '../services/FertilizerService';
import FertilizerModel from '../models/FertilizerModel';
import { verifyToken } from '../utils/jwt';

export const createFertilizerController = async (
  req: Request,
  res: Response
) => {
  try {
    let category: string | undefined = '';
    const { name, quantityAvailable, pricePerKg, maxQuantityPerAcre } =
      req.body;

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { user } = verifyToken(token);
      if (user) {
        category = user.category;
      }
    }

    if (category !== 'agro_store') {
      return res
        .status(StatusCodeEmums.UNAUTHORIZED)
        .json({ message: 'Access denied' });
    }

    if (!name || quantityAvailable <= 0 || maxQuantityPerAcre <= 0) {
      return res
        .status(StatusCodeEmums.BAD_REQUEST)
        .json({ message: 'Required fields are missing or invalid' });
    }

    if (maxQuantityPerAcre > 3) {
      return res.status(StatusCodeEmums.BAD_REQUEST).json({
        message: 'Fertilizer quantity exceeds the maximum limit for 1 acre',
      });
    }
    const fertilizerObj = {
      name,
      quantityAvailable,
      maxQuantityPerAcre,
      pricePerKg,
    };

    const fertilizerInstance = await createFertilizer(fertilizerObj);
    return res
      .status(StatusCodeEmums.OK)
      .json({ success: true, fertilizerInstance });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not save a fertilizer',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getFertilizersController = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query as {
      perPage: string;
      page: string;
    };

    const fertilizerData = await findAllFertilizers(
      parseInt(page, 10) || 1,
      parseInt(perPage) || 5
    );
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch fertilizer',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getFertilizersForForm = async (req: Request, res: Response) => {
  try {
    const fertilizerData = await FertilizerModel.find();
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch fertilizer',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getFertilizerController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as {
      id: string;
    };

    const fertilizer = await findFertilizerById(id);
    if (fertilizer) {
      return res.status(StatusCodeEmums.OK).send(fertilizer);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Fertilizer not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Fertilizer',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updateFertilizerController = async (
  req: Request,
  res: Response
) => {
  try {
    let category: string | undefined = '';
    const { id } = req.query as {
      id: string;
    };
    const {
      name,
      quantityAvailable,
      maxQuantityPerAcre,
      pricePerKg,
      pricingId,
    } = req.body as {
      name: string;
      quantityAvailable: number;
      maxQuantityPerAcre: number;
      pricePerKg: number;
      pricingId?: ObjectId;
    };

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { user } = verifyToken(token);
      if (user) {
        category = user.category;
      }
    }
    if (category !== 'agro_store') {
      return res
        .status(StatusCodeEmums.UNAUTHORIZED)
        .json({ message: 'Access denied' });
    }

    const findFertilizer = await findFertilizerById(id);
    if (!findFertilizer) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'Fertilizer not Found' });
    }
    if (maxQuantityPerAcre > 3) {
      return res.status(StatusCodeEmums.BAD_REQUEST).json({
        message: 'Fertilizer quantity exceeds the maximum limit for 1 acre',
      });
    }
    const fertilizerObj = {
      name,
      quantityAvailable,
      maxQuantityPerAcre,
      pricePerKg,
      pricingID: pricingId,
    };
    const updatedFertilizer = await updateFertilizer(id, fertilizerObj);
    if (updatedFertilizer) {
      return res.status(StatusCodeEmums.OK).send(updatedFertilizer);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Fertilizer not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch fertilizer',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
