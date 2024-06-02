import { ObjectId } from 'mongoose';
import OrderModel from '../models/OrderModel';
import { Order } from '../interfaces/Order';
import logger from '../utils/logger';

export const createOrder = async (orderData: Order) => {
  try {
    const seed = new OrderModel(orderData);
    return await seed.save();
  } catch (error) {
    logger.error('Failed to create order', error);
    throw error;
  }
};
export const findAllOrders = async (
  farmerID?: ObjectId,
  page: number = 1,
  perPage: number = 5
) => {
  try {
    let orders: any;
    let totalItems: number;
    const offset = (page - 1) * perPage;
    if (farmerID) {
      orders = await OrderModel.find({ farmerID })
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(perPage)
        .populate('pricingID')
        .populate('farmerID')
        .populate('seedID')
        .populate('fertilizerID')
        .exec();
      totalItems = await OrderModel.countDocuments({ farmerID }).exec();
    } else {
      orders = await OrderModel.find()
        .sort({ timestamp: -1 })
        .skip(offset)
        .limit(perPage)
        .populate('landID')
        .populate('farmerID')
        .populate('seedID')
        .populate('fertilizerID')
        .exec();
      totalItems = await OrderModel.countDocuments().exec();
    }

    const totalPages = Math.ceil(totalItems / perPage);

    return {
      data: orders,
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

export const updateOrder = async (id: string, updateData: Partial<Order>) => {
  try {
    const updatedSeed = await OrderModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate('landID')
      .populate('farmerID')
      .populate('seedID')
      .populate('fertilizerID')
      .exec();

    if (!updatedSeed) {
      throw new Error('Order not found or cannot be updated');
    }

    return updatedSeed;
  } catch (error) {
    logger.error('Failed to update order', error);
    throw error;
  }
};

export const findOrderById = async (id: string) => {
  try {
    return await OrderModel.findById(id)
      .populate('landID')
      .populate('farmerID')
      .populate('seedID')
      .populate('fertilizerID')
      .lean();
  } catch (error) {
    logger.error('Failed to find order', error);
    throw error;
  }
};
