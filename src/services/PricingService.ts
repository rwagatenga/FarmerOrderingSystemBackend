import PricingModel from '../models/PricingModel';
import { Pricing } from '../interfaces/Pricing';
import { BadRequestError } from '../errors/BadRequestError';
import StatusCodeEmums from '../enums/StatusCodeEnums';
import logger from '../utils/logger';
import { NotFoundError } from '../errors/NotFoundError';

export const createPricingService = async (pricing: Partial<Pricing>) => {
  try {
    const Pricing = new PricingModel(pricing);
    const savedPricing = await Pricing.save();

    return savedPricing;
  } catch (error: any) {
    await new PricingModel({
      level: 'error saving pricing',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const findPricingByIdService = async (pricingId: string) => {
  try {
    const pricing = await PricingModel.findById(pricingId).populate(
      'productID',
      'name'
    );
    if (!pricing) {
      throw new NotFoundError('Pricing not found');
    }
    return pricing;
  } catch (error: any) {
    logger.error(error.message);
    throw new NotFoundError(error.message);
  }
};

export const updatePricingService = async (
  id: string,
  pricePerKg: number,
  productId?: string
) => {
  if (!id && !productId) {
    throw new BadRequestError('No identifier provided to update pricing.');
  }

  const criteria = id ? { _id: id } : { productID: productId };
  const updatedPricing = await PricingModel.findOneAndUpdate(
    criteria,
    { $set: { PricePerKg: pricePerKg } },
    { new: true }
  ).exec();

  if (!updatedPricing) {
    throw new NotFoundError('Pricing not found.');
  }

  return updatedPricing;
};

export const findProductPricing = async (id?: string, productId?: string) => {
  if (!id && !productId) {
    throw new BadRequestError('No identifier provided to find pricing.');
  }

  const criteria = id ? { _id: id } : { ProductID: productId };
  return await PricingModel.findOne(criteria)
    .populate('productID', 'name')
    .exec();
};

export const findPricingsWithPagination = async (page = 1, limit = 5) => {
  const skip = (page - 1) * limit;
  const pricings = await PricingModel.find()
    .populate('productID', 'name')
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .exec();

  const totalDocuments = await PricingModel.countDocuments();
  const totalPages = Math.ceil(totalDocuments / limit);

  return {
    pricings,
    totalDocuments,
    totalPages,
    currentPage: page,
    perPage: limit,
  };
};
