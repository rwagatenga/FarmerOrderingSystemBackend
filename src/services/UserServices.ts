import { ObjectId } from 'mongoose';
import logger from '../utils/logger';
import { User } from '../interfaces/User';
import UserModel from '../models/UserModel';
import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import StatusCodeEmums from '../enums/StatusCodeEnums';

export const createUserService = async (user: User) => {
  try {
    const User = new UserModel(user);
    const savedUser = await User.save();

    return savedUser;
  } catch (error: any) {
    await new ErrorModel({
      level: 'error saving user',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getUserByEmail = async (email: string) =>
  await UserModel.findOne({ email }).where('email').lean();

export const getUserByPhone = async (phone: string) =>
  UserModel.findOne({ phone }).where('phone').exec();

export const getUserById = async (id: ObjectId) => await UserModel.findById(id);

export const findAllFarmers = async (page: number = 1, perPage: number = 5) => {
  try {
    const farmerCategory = 'farmer';
    const offset = (page - 1) * perPage;

    const query = UserModel.find({ category: farmerCategory });

    const users = await query
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(perPage)
      .exec();

    const totalItems = await UserModel.countDocuments({
      category: farmerCategory,
    }).exec();
    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: users,
      totalItems,
      totalPages,
      currentPage: page,
      perPage,
    };
  } catch (error) {
    logger.error('Failed to fetch farmers', error);
    throw error;
  }
};

export const updateUserService = async (
  id: ObjectId,
  userObj: Partial<User>
) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: userObj },
      { new: true }
    ).exec();

    if (!updatedUser) {
      throw new Error('User not found or cannot be updated');
    }

    return updatedUser;
  } catch (error: any) {
    await new ErrorModel({
      level: 'error saving user',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
