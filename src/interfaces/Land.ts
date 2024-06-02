import { ObjectId } from 'mongoose';

export interface Land {
  _id?: ObjectId;
  farmerID: ObjectId;
  landAddress: string;
  landUPI: string;
  sizeInAcres: number;
}
