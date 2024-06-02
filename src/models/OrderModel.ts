import mongoose, { Schema } from 'mongoose';
import { Order, OrderStatus, PaymentStatus } from '../interfaces/Order';

const OrderSchema: Schema = new Schema({
  farmerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landID: {
    type: Schema.Types.ObjectId,
    ref: 'Land',
    required: true,
  },
  fertilizerID: {
    type: Schema.Types.ObjectId,
    ref: 'Fertilizer',
    required: true,
  },
  seedID: {
    type: Schema.Types.ObjectId,
    ref: 'Seed',
    required: true,
  },
  fertilizerQuantityOrdered: {
    type: Number,
    required: true,
  },
  seedQuantityOrdered: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: Object.values(PaymentStatus),
    required: true,
  },
  seedPricePerUnit: {
    type: Number,
    required: true,
  },
  seedTotalPrice: {
    type: Number,
    required: true,
  },
  fertilizerPricePerUnit: {
    type: Number,
    required: true,
  },
  fertilizerTotalPrice: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
  },
});

const OrderModel = mongoose.model<Order>('Order', OrderSchema);

export default OrderModel;
