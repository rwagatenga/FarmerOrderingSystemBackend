import mongoose from 'mongoose';

const errorSchema = new mongoose.Schema({
  level: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
  code: {
    type: String,
  },
  timestamp: {
    type: Date,
  },
  error: {
    type: Array,
  },
});

const ErrorModel = mongoose.model('Errors', errorSchema);

export default ErrorModel;
