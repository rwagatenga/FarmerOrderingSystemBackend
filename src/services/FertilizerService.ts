import logger from '../utils/logger';
import { Fertilizer } from '../interfaces/Fertilizer';
import FertilizerModel from '../models/FertilizerModel';

export const createFertilizer = async (fertilizerData: Fertilizer) => {
  try {
    const fertilizer = new FertilizerModel(fertilizerData);
    return await fertilizer.save();
  } catch (error) {
    logger.error('Failed to create fertilizer', error);
    throw error;
  }
};

export const updateFertilizer = async (
  _id: string,
  updateData: Partial<Fertilizer>
) => {
  try {
    const updatedFertilizer = await FertilizerModel.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    )
      .populate('pricingID')
      .exec();

    if (!updatedFertilizer) {
      throw new Error('Fertilizer not found or cannot be updated');
    }

    return updatedFertilizer;
  } catch (error) {
    logger.error('Failed to update fertilizer', error);
    throw error;
  }
};

export const findFertilizerById = async (_id: string) => {
  try {
    return await FertilizerModel.findById(_id).populate('pricingID').exec();
  } catch (error) {
    logger.error('Failed to find fertilizer', error);
    throw error;
  }
};

export const findAllFertilizers = async (
  page: number = 1,
  perPage: number = 5
) => {
  try {
    const offset = (page - 1) * perPage;
    const fertilizers = await FertilizerModel.find()
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(perPage)
      .populate('pricingID')
      .exec();

    const totalItems = await FertilizerModel.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: fertilizers,
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
    };
  } catch (error) {
    logger.error('Failed to fetch fertilizers', error);
    throw error;
  }
};

export const deleteFertilizer = async (id: string) => {
  try {
    const result = await FertilizerModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Fertilizer not found or cannot be deleted');
    }
    return result;
  } catch (error) {
    logger.error('Failed to delete fertilizer', error);
    throw error;
  }
};
