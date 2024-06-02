import { ObjectId } from 'mongoose';

export enum UserEnum {
  FARMER = 'farmer',
  AGRO_STORE = 'agro_store',
}
export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: UserEnum;
  password: string;
  passwordExpiresAt?: Date;
  loginTries?: number;
  loggedIn?: boolean;
}

export type RequestUser = Pick<User, '_id' | 'name' | 'email'> & {
  category?: string;
};
