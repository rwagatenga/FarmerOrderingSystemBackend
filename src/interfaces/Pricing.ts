import { ObjectId } from 'mongoose';

export enum ProductTypeEnum {
  SEED = 'Seed',
  FERTILIZER = 'Fertilizer',
}
export interface Pricing {
  _id?: ObjectId;
  productType: ProductTypeEnum;
  productID?: ObjectId;
  pricePerKg: number;
}
