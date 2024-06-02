import { Response, Request } from 'express';

import StatusCodeEmums from '../enums/StatusCodeEnums';

import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import logger from '../utils/logger';
import {
  createPricingService,
  findPricingByIdService,
  findPricingsWithPagination,
  findProductPricing,
  updatePricingService,
} from '../services/PricingService';
import PricingModel from '../models/PricingModel';
import { verifyToken } from '../utils/jwt';

export const createPricingController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const { productID, pricePerKg } = req.body;

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

    if (!productID || pricePerKg <= 0) {
      return res
        .status(StatusCodeEmums.BAD_REQUEST)
        .json({ message: 'Required fields are missing or invalid' });
    }

    const pricingObj = {
      productID,
      pricePerKg,
    };

    const fertilizerInstance = await createPricingService(pricingObj);
    return res
      .status(StatusCodeEmums.OK)
      .json({ success: true, fertilizerInstance });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not save a Pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getPricingsController = async (req: Request, res: Response) => {
  try {
    const { page, perPage } = req.query as {
      perPage: string;
      page: string;
    };

    const fertilizerData = await findPricingsWithPagination(
      parseInt(page, 10) || 1,
      parseInt(perPage) || 5
    );
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getPricingsForForm = async (req: Request, res: Response) => {
  try {
    const fertilizerData = await PricingModel.find();
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getPricingController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as {
      id: string;
    };

    const Pricing = await findPricingByIdService(id);
    if (Pricing) {
      return res.status(StatusCodeEmums.OK).send(Pricing);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Pricing not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updatePricingController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const { id, productID } = req.query as {
      id: string;
      productID?: string;
    };
    const { pricePerKg } = req.body as {
      pricePerKg: number;
      productID?: string;
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

    const findPricing = await findPricingByIdService(id);
    if (!findPricing) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'Pricing not Found' });
    }

    const updatedPricing = await updatePricingService(
      id,
      pricePerKg,
      productID
    );
    if (updatedPricing) {
      return res.status(StatusCodeEmums.OK).send(updatedPricing);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Pricing not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getProductPriceController = async (
  req: Request,
  res: Response
) => {
  try {
    const { productID } = req.query as {
      productID: string;
    };

    const Pricing = await findProductPricing(productID);
    if (Pricing) {
      return res.status(StatusCodeEmums.OK).send(Pricing);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Pricing not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch Product price',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
