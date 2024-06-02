import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { RequestUser } from '../interfaces/User';

const secret = process.env.JWT_SECRET || '';
const expiresIn = process.env.JWT_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN;

declare module 'jsonwebtoken' {
  export interface JwtPayload {
    user?: RequestUser;
  }
}

const generateToken = (user: RequestUser) =>
  jwt.sign({ user }, secret, { expiresIn });

const generateRefreshToken = (user: RequestUser) =>
  jwt.sign({ user }, secret, { expiresIn: refreshTokenExpiresIn });

const verifyToken = (token: string) =>
  <jwt.JwtPayload>jwt.verify(token, secret);

export { generateToken, verifyToken, generateRefreshToken };
