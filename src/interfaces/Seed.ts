import { ObjectId } from 'mongoose';

export interface Seed {
  _id?: ObjectId;
  name: string;
  quantityAvailable: number; // Quantity in kgs
  compatibleFertilizers: ObjectId[]; // (assuming it's an array of Fertilizer IDs)
  maxQuantityPerAcre: number; // Maximum quantity per acre, e.g., 1kg for maize
  pricePerKg: number;
  pricingID?: ObjectId;
}
