import mongoose, { Schema, Document } from 'mongoose';
import { Land } from '../interfaces/Land';

const LandSchema: Schema = new Schema({
  farmerID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  landAddress: {
    type: String,
    required: true,
  },
  landUPI: {
    type: String,
    required: true,
  },
  sizeInAcres: { type: Number, required: true },
  timestamp: {
    type: Date,
  },
});

const LandModel = mongoose.model<Land>('Land', LandSchema);

export default LandModel;
