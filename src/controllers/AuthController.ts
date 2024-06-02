import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { generateToken, verifyToken, generateRefreshToken } from '../utils/jwt';
import { redisClient } from '../utils/redis';
import { getUserByEmail, getUserById } from '../services/UserServices';
import { getSession, removeSession, storeSession } from '../utils/session';
import { getDateDifference } from '../utils/dates';
import StatusCodeEmums from '../enums/StatusCodeEnums';
import { User } from '../interfaces/User';
import UserModel from '../models/UserModel';

export const userLoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let success = false;
  let message = '';
  let passwordExpiryMessage = '';
  let daysLeft: any;

  const user = await getUserByEmail(email);

  if (!user) {
    message = 'Invalid email or password';
    return res.status(StatusCodeEmums.BAD_REQUEST).json({ success, message });
  }
  const { _id, passwordExpiresAt } = user;

  if (passwordExpiresAt) {
    daysLeft = getDateDifference(passwordExpiresAt, new Date());
  }
  if (daysLeft < 4 && daysLeft > 0) {
    passwordExpiryMessage = `You have ${daysLeft} day(s) left until your password expires.`;
  }

  if (daysLeft <= 0) {
    passwordExpiryMessage =
      'Password is already expired. You must change your password now.';
  }

  const isMatched = await bcrypt.compare(password, user.password);

  const userId = _id;

  if (!isMatched) {
    message = 'Invalid email or password';

    return res.status(StatusCodeEmums.BAD_REQUEST).json({ success, message });
  }
  success = true;
  message = 'Login successful';

  let userObj: any = {};

  userObj = user;

  await redisClient.sRem('user-password-changed-ids', userId.toString());

  const token = generateToken(userObj);
  const refreshToken = generateRefreshToken(userObj);
  const existingSession = await getSession(userId.toString());

  if (existingSession) {
    // Invalidate previous session
    await removeSession(userId.toString());
  }

  await storeSession(userId.toString(), token);

  await UserModel.updateOne({ loggedIn: true });
  return res.status(StatusCodeEmums.OK).json({
    success,
    message,
    token,
    refreshToken,
    passwordExpiryMessage,
    passwordExpiresAt: passwordExpiresAt,
  });
};

export const userLogoutController = async (req: Request, res: Response) => {
  let success = false;
  let message = '';

  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    try {
      const { user } = verifyToken(token);

      if (user && user._id) {
        await removeSession(user._id.toString());
        const currentUser = await getUserById(user._id);

        if (currentUser?.loggedIn) {
          currentUser.loggedIn = false;

          await currentUser.save();
        }
      }

      success = true;
      message = 'Logged out successfully.';

      return res.status(StatusCodeEmums.OK).json({ success, message });
    } catch (error) {
      success = false;
      message = 'Server Error';

      return res
        .status(StatusCodeEmums.INTERNAL_SERVER_ERROR)
        .json({ message });
    }
  }
};

export const generateNewAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const accessToken = req.headers.authorization?.split(' ')[1];

  let success = false;
  let userId = '';

  if (accessToken) {
    try {
      verifyToken(refreshToken);
      const user = verifyToken(refreshToken).user;
      const accessTokenExpireTime = verifyToken(accessToken).exp;
      const currentTime = Math.floor(Date.now() / 1000);
      const accessTokenTtl = (accessTokenExpireTime as number) - currentTime;

      if (!req.user) return;

      if (req.user?._id) {
        userId = req.user._id.toString();
      }
      const newAccessToken = generateToken(req.user);

      await redisClient
        .multi()
        .sAdd('jwt-blacklisted-tokens', accessToken)
        .expire('jwt-blacklisted-tokens', accessTokenTtl)
        .exec();

      const existingSession = await getSession(userId);
      if (existingSession) {
        await removeSession(userId.toString());
      }
      await storeSession(userId.toString(), newAccessToken);

      success = true;

      return res
        .status(StatusCodeEmums.OK)
        .json({ success, token: newAccessToken });
    } catch (error) {
      return res
        .status(StatusCodeEmums.UNAUTHORIZED)
        .json({ success, message: 'Invalid refresh token' });
    }
  }
};
