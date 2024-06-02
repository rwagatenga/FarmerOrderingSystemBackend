import mongoose, { Schema } from 'mongoose';

import { Fertilizer } from '../interfaces/Fertilizer';

const FertilizerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantityAvailable: {
    type: Number,
    required: true,
  },
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

const FertilizerModel = mongoose.model<Fertilizer>(
  'Fertilizer',
  FertilizerSchema
);

export default FertilizerModel;
