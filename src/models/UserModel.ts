import mongoose from 'mongoose';
import { User, UserEnum } from '../interfaces/User';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    require: true,
  },
  category: {
    type: String,
    enum: Object.values(UserEnum),
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  passwordExpiresAt: {
    type: Date,
  },
  loginTries: { type: Number },
  loggedIn: { type: Boolean },
  timestamp: {
    type: Date,
  },
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
