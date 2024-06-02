import mongoose, { Schema, Document } from 'mongoose';
import { Seed } from '../interfaces/Seed';

const SeedSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantityAvailable: {
    type: Number,
    required: true,
  },
  compatibleFertilizers: [{ type: Schema.Types.ObjectId, ref: 'Fertilizer' }],
  maxQuantityPerAcre: {
    type: Number,
    required: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  pricingID: {
    type: Schema.Types.ObjectId,
    ref: 'Pricing',
  },
  timestamp: {
    type: Date,
  },
});

const SeedModel = mongoose.model<Seed>('Seed', SeedSchema);

export default SeedModel;
