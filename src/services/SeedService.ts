import { populate } from 'dotenv';
import { Seed } from '../interfaces/Seed';
import SeedModel from '../models/SeedModel';
import logger from '../utils/logger';

export const createSeed = async (seedData: Seed) => {
  try {
    const seed = new SeedModel(seedData);
    return await seed.save();
  } catch (error) {
    logger.error('Failed to create seed', error);
    throw error;
  }
};

export const updateSeed = async (id: string, updateData: Partial<Seed>) => {
  try {
    const updatedSeed = await SeedModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate('pricingID')
      .populate('compatibleFertilizers')
      .exec();

    if (!updatedSeed) {
      throw new Error('Seed not found or cannot be updated');
    }

    return updatedSeed;
  } catch (error) {
    logger.error('Failed to update seed', error);
    throw error;
  }
};

export const findSeedById = async (id: string) => {
  try {
    return await SeedModel.findById(id)
      .populate('pricingID')
      .populate('compatibleFertilizers')
      .exec();
  } catch (error) {
    logger.error('Failed to find seed', error);
    throw error;
  }
};

export const findAllSeeds = async (page: number = 1, perPage: number = 5) => {
  try {
    const offset = (page - 1) * perPage;
    const seeds = await SeedModel.find()
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(perPage)
      .populate('pricingID')
      .populate('compatibleFertilizers')
      .exec();

    const totalItems = await SeedModel.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: seeds,
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
    };
  } catch (error) {
    logger.error('Failed to fetch seeds', error);
    throw error;
  }
};

export const deleteSeed = async (id: string) => {
  try {
    const result = await SeedModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new Error('Seed not found or cannot be deleted');
    }
    return result;
  } catch (error) {
    logger.error('Failed to delete seed', error);
    throw error;
  }
};
