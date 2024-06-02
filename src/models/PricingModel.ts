import mongoose, { Schema } from 'mongoose';
import { Pricing, ProductTypeEnum } from '../interfaces/Pricing';

const PricingSchema: Schema = new Schema({
  productType: {
    type: String,
    enum: ProductTypeEnum,
    required: true,
  },
  productID: {
    type: Schema.Types.ObjectId,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
  },
});

const PricingModel = mongoose.model<Pricing>('Pricing', PricingSchema);

export default PricingModel;
