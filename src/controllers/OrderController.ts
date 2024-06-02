import { Response, Request } from 'express';
import { ObjectId } from 'mongoose';
import { verifyToken } from '../utils/jwt';
import StatusCodeEmums from '../enums/StatusCodeEnums';
import { BadRequestError } from '../errors/BadRequestError';
import { OrderStatus, PaymentStatus } from '../interfaces/Order';
import ErrorModel from '../models/ErrorModel';
import {
  createOrder,
  findAllOrders,
  findOrderById,
  updateOrder,
} from '../services/OrderService';
import logger from '../utils/logger';

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const {
      farmerID,
      landID,
      fertilizerID,
      seedID,
      fertilizerQuantityOrdered,
      seedQuantityOrdered,
      status,
      paymentStatus,
      seedPricePerUnit,
      seedTotalPrice,
      fertilizerPricePerUnit,
      fertilizerTotalPrice,
    } = req.body as {
      farmerID: ObjectId;
      landID: ObjectId;
      fertilizerID: ObjectId;
      seedID: ObjectId;
      fertilizerQuantityOrdered: number;
      seedQuantityOrdered: number;
      status: OrderStatus;
      paymentStatus: PaymentStatus;
      seedPricePerUnit: number;
      seedTotalPrice: number;
      fertilizerPricePerUnit: number;
      fertilizerTotalPrice: number;
    };

    const orderObj = {
      farmerID,
      landID,
      fertilizerID,
      seedID,
      fertilizerQuantityOrdered,
      seedQuantityOrdered,
      status,
      paymentStatus,
      seedPricePerUnit,
      seedTotalPrice,
      fertilizerPricePerUnit,
      fertilizerTotalPrice,
    };

    const fertilizerInstance = await createOrder(orderObj);
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

export const getOrdersController = async (req: Request, res: Response) => {
  try {
    const { page, perPage, farmerID } = req.query as unknown as {
      perPage: string;
      page: string;
      farmerID?: ObjectId;
    };

    const fertilizerData = await findAllOrders(
      farmerID,
      parseInt(page, 10) || 1,
      parseInt(perPage, 10) || 5
    );
    return res.status(StatusCodeEmums.OK).json(fertilizerData);
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch orders',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  try {
    let category: string | undefined = '';
    const { id } = req.query as {
      id: string;
    };
    console.log('ID', id);
    const { status, paymentStatus } = req.body as {
      status: OrderStatus;
      paymentStatus: PaymentStatus;
    };

    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const { user } = verifyToken(token);
      if (user) {
        category = user.category;
      }
    }
    let orderObj = {};

    const findOrder = await findOrderById(id);
    if (!findOrder) {
      return res
        .status(StatusCodeEmums.NOT_FOUND)
        .json({ success: false, message: 'Order not Found' });
    }
    if (
      category === 'agro_store' &&
      findOrder.status !== OrderStatus.APPROVED &&
      findOrder.paymentStatus === PaymentStatus.UNPAID
    ) {
      orderObj = {
        paymentStatus,
        status,
      };
    } else {
      return res
        .status(StatusCodeEmums.BAD_REQUEST)
        .json({ success: false, message: 'Order cannot be updated' });
    }
    const updatedOrder = await updateOrder(id, orderObj);
    if (updatedOrder) {
      return res.status(StatusCodeEmums.OK).send(updatedOrder);
    }
    return res
      .status(StatusCodeEmums.NOT_FOUND)
      .json({ success: true, message: 'Order not Found' });
  } catch (error: any) {
    await new ErrorModel({
      level: 'Could not fetch order',
      message: new BadRequestError(error.message),
      code: StatusCodeEmums.BAD_REQUEST,
      error,
    }).save();
    logger.error(error.message);
    throw new BadRequestError(error.message);
  }
};
