import { Land } from '../interfaces/Land';
import LandModel from '../models/LandModel';
import logger from '../utils/logger';

export const createLand = async (landData: Partial<Land>) => {
  try {
    const land = new LandModel(landData);
    return await land.save();
  } catch (error) {
    logger.error('Failed to create land', error);
    throw error;
  }
};

export const findLandById = async (id: string) => {
  try {
    return await LandModel.findById(id).populate('farmerID').exec();
  } catch (error) {
    logger.error('Failed to find land', error);
    throw error;
  }
};

export const updateLand = async (id: string, updateData: Partial<Land>) => {
  try {
    const updatedLand = await LandModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate('farmerID')
      .exec();

    if (!updatedLand) {
      throw new Error('Land not found or cannot be updated');
    }

    return updatedLand;
  } catch (error) {
    logger.error('Failed to update land', error);
    throw error;
  }
};

export const findAllLands = async (page: number = 1, perPage: number = 5) => {
  try {
    const offset = (page - 1) * perPage;
    const lands = await LandModel.find()
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(perPage)
      .populate('farmerID')
      .exec();

    const totalItems = await LandModel.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: lands,
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
    };
  } catch (error) {
    logger.error('Failed to fetch lands', error);
    throw error;
  }
};
