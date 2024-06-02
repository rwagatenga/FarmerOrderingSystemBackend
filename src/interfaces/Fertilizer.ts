import { ObjectId } from 'mongoose';

export interface Fertilizer {
  _id?: ObjectId;
  name: string;
  quantityAvailable: number; // Quantity in kgs
  maxQuantityPerAcre: number; // Usage limit in kgs per acre  (e.g., 3kg for lime)
  pricePerKg: number;
  pricingID?: ObjectId;
}
