import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';

import StatusCodeEmums from '../enums/StatusCodeEnums';

import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import logger from '../utils/logger';

import { verifyToken } from '../utils/jwt';
import {
  createSeed,
  findAllSeeds,
  findSeedById,
  updateSeed,
} from '../services/SeedService';
import SeedModel from '../models/SeedModel';

export const createSeedController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const {
      name,
      quantityAvailable,
      compatibleFertilizers,
      pricePerKg,
      pricingID,
      maxQuantityPerAcre,
    } = req.body as {
      name: string;
      quantityAvailable: number;
      compatibleFertilizers: ObjectId[];
      maxQuantityPerAcre: number;
      pricePerKg: number;
      pricingID?: ObjectId;
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

    if (!name || quantityAvailable <= 0 || maxQuantityPerAcre <= 0) {
      return res
        .status(StatusCodeEmums.BAD_REQUEST)
        .json({ message: 'Required fields are missing or invalid' });
    }

    if (maxQuantityPerAcre > 1 || maxQuantityPerAcre <= 0) {
      return res.status(StatusCodeEmums.BAD_REQUEST).json({
        message: 'Seed quantity exceeds the maximum limit for 1 acre',
      });
    }
    const seedObj = {
      name,
      quantityAvailable,
      compatibleFertilizers,
      pricePerKg,
      pricingID,
      maxQuantityPerAcre,
    };

    const fertilizerInstance = await createSeed(seedObj);
    return res
      .status(StatusCodeEmums.OK)
      .json({ success: true, fertilizerInstance });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not save a seed',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getSeedsController = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query as {
      perPage: string;
      page: string;
    };

    const fertilizerData = await findAllSeeds(
      parseInt(page, 10) || 1,
      parseInt(perPage) || 5
    );
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch seed',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getSeedsForForm = async (req: Request, res: Response) => {
  try {
    const fertilizerData = await SeedModel.find()
      .populate('compatibleFertilizers')
      .exec();
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch seed',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getSeedController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as {
      id: string;
    };

    const seed = await findSeedById(id);
    if (seed) {
      return res.status(StatusCodeEmums.OK).send(seed);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Seed not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Seed',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updateSeedController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const { id } = req.query as {
      id: string;
    };
    const {
      name,
      quantityAvailable,
      compatibleFertilizers,
      maxQuantityPerAcre,
      pricePerKg,
      pricingId,
    } = req.body as {
      name: string;
      quantityAvailable: number;
      maxQuantityPerAcre: number;
      pricePerKg: number;
      pricingId?: ObjectId;
      compatibleFertilizers: ObjectId[];
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

    const findSeed = await findSeedById(id);
    if (!findSeed) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'Seed not Found' });
    }
    if (maxQuantityPerAcre > 1 || maxQuantityPerAcre <= 0) {
      return res.status(StatusCodeEmums.BAD_REQUEST).json({
        message: 'Seed quantity exceeds the maximum limit for 1 acre',
      });
    }
    const seedObj = {
      name,
      quantityAvailable,
      compatibleFertilizers,
      maxQuantityPerAcre,
      pricePerKg,
      pricingID: pricingId,
    };
    const updatedSeed = await updateSeed(id, seedObj);
    if (updatedSeed) {
      return res.status(StatusCodeEmums.OK).send(updatedSeed);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Seed not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch seed',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
