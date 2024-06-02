import { Response, Request } from 'express';
import bcrypt from 'bcrypt';

import StatusCodeEmums from '../enums/StatusCodeEnums';
import {
  createUserService,
  findAllFarmers,
  getUserByEmail,
  getUserById,
  getUserByPhone,
  updateUserService,
} from '../services/UserServices';
import ErrorModel from '../models/ErrorModel';
import { BadRequestError } from '../errors/BadRequestError';
import logger from '../utils/logger';
import { User } from '../interfaces/User';
import { verifyToken } from '../utils/jwt';
import { ObjectId } from 'mongoose';

export const createUserController = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, address, category, password } = req.body;

    const SALT_ROUND = 10;
    let message: string;
    const success = false;

    const verifyEmailExist = await getUserByEmail(email);
    if (email && verifyEmailExist) {
      message = 'Email already exist';

      return res.status(StatusCodeEmums.BAD_REQUEST).json({ success, message });
    }

    const verifyPhoneExist = await getUserByPhone(phone);
    if (phone && verifyPhoneExist) {
      message = 'Phone number already exist';

      return res.status(StatusCodeEmums.BAD_REQUEST).json({ success, message });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const userObj = {
      name,
      phone,
      email,
      address,
      category,
      password: hashedPassword,
    };

    const userInstance = await createUserService(userObj);
    return res.status(StatusCodeEmums.OK).json({ success: true, userInstance });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not save a user',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getFarmersController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const { page, perPage } = req.query as {
      perPage: string;
      page: string;
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

    const farmersData = await findAllFarmers(
      parseInt(page, 10) || 1,
      parseInt(perPage) || 5
    );
    return res.status(StatusCodeEmums.OK).json(farmersData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch users',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const getUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as unknown as {
      id: ObjectId;
    };

    const user = await getUserById(id);
    if (user) {
      return res.status(StatusCodeEmums.OK).send(user);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'User not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch user',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updateUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.query as unknown as {
      id: ObjectId;
    };
    const { name, email, phone, address } = req.body as {
      name: string;
      email: string;
      phone: string;
      address: string;
    };
    const findUser = await getUserById(id);
    if (!findUser) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'User not Found' });
    }
    const userObj = {
      name,
      email,
      phone,
      address,
    };
    const updatedUser = await updateUserService(id, userObj);
    if (updatedUser) {
      return res.status(StatusCodeEmums.OK).send(updatedUser);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'User not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch user',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
