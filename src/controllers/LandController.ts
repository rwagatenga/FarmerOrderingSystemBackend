import { Response, Request } from 'express';

import { ObjectId } from 'mongoose';
import StatusCodeEmums from '../enums/StatusCodeEnums';

import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import logger from '../utils/logger';
import {
  createLand,
  findAllLands,
  findLandById,
  updateLand,
} from '../services/LandService';
import LandModel from '../models/LandModel';
import { verifyToken } from '../utils/jwt';
import { getUserByEmail, getUserById } from '../services/UserServices';

export const createLandController = async (req: Request, res: Response) => {
  try {
    const { landAddress, farmerID, landUPI, sizeInAcres } = req.body as {
      sizeInAcres: number;
      farmerID: ObjectId;
      landAddress: string;
      landUPI: string;
    };

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { user } = verifyToken(token);
      if (user) {
        const getUser = await getUserByEmail(user.email);
        if (!getUser) {
          return res
            .status(StatusCodeEmums.NOT_FOUND)
            .json({ message: 'User not found denied' });
        }
      }
    }

    if (sizeInAcres <= 0) {
      return res
        .status(StatusCodeEmums.BAD_REQUEST)
        .json({ message: 'Size is required' });
    }
    const farmerId = await getUserById(farmerID);
    if (!farmerId) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ message: 'Farmer ID is not Found' });
    }
    const landObj = {
      landAddress,
      farmerID,
      landUPI,
      sizeInAcres,
    };

    const landInstance = await createLand(landObj);
    return res.status(StatusCodeEmums.OK).json({ success: true, landInstance });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not save a land',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getLandsController = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query as {
      perPage: string;
      page: string;
    };

    const landData = await findAllLands(
      parseInt(page, 10) || 1,
      parseInt(perPage) || 5
    );
    return res.status(StatusCodeEmums.OK).json(landData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch land',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getLandsForForm = async (req: Request, res: Response) => {
  try {
    const landData = await LandModel.find();
    if (!landData) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ message: 'Cannot get Land' });
    }
    return res.status(StatusCodeEmums.OK).json(landData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch land',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getLandController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as {
      id: string;
    };

    const land = await findLandById(id);
    if (land) {
      return res.status(StatusCodeEmums.OK).send(land);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Land not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Land',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updateLandController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as {
      id: string;
    };
    const { sizeInAcres } = req.body as { sizeInAcres: number };

    const findLand = await findLandById(id);
    if (!findLand) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'Land not Found' });
    }

    const landObj = {
      sizeInAcres,
    };
    const updatedLand = await updateLand(id, landObj);
    if (updatedLand) {
      return res.status(StatusCodeEmums.OK).send(updatedLand);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Land not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch land',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getFarmersLandController = async (req: Request, res: Response) => {
  const { farmerID } = req.query as {
    farmerID: string;
  };
  const farmerLand = await LandModel.find({ farmerID }).lean();
  if (!farmerLand) {
    return res
      .status(StatusCodeEmums.BAD_REQUEST)
      .send({ message: 'Cannot get farmerLand' });
  }
  return res.status(StatusCodeEmums.OK).send(farmerLand);
};
