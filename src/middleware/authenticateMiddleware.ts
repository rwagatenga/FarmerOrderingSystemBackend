import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../utils/jwt';
import { redisClient } from '../utils/redis';
import { RequestUser } from '../interfaces/User';
import StatusCodeEmums from '../enums/StatusCodeEnums';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(StatusCodeEmums.UNAUTHORIZED)
      .json({ message: 'Authorization header missing' });
  }

  const token = authHeader?.split(' ')[1];
  if (!token) {
    return res
      .status(StatusCodeEmums.UNAUTHORIZED)
      .json({ message: 'No token provided' });
  }

  try {
    redisClient
      .sIsMember('jwt-blacklisted-tokens', token)
      .then(async (isTokenBlacklisted: any) => {
        if (isTokenBlacklisted) {
          return res
            .status(StatusCodeEmums.UNAUTHORIZED)
            .json({ message: 'Invalid token' });
        }

        const decodedToken = verifyToken(token);
        req.user = decodedToken.user as RequestUser;
        if (typeof req.user._id === 'undefined') {
          throw new Error(
            'User ID is undefined. Cannot check membership in redis set.'
          );
        }

        const result = await redisClient.sIsMember(
          'user-blacklisted-ids',
          req.user._id.toString() // now guaranteed not to be undefined
        );

        const passwordChanged = await redisClient.sIsMember(
          'user-password-changed-ids',
          req.user._id.toString()
        );

        if (result) {
          return res
            .status(StatusCodeEmums.UNAUTHORIZED)
            .json({ message: 'User Deactivated' });
        }

        if (passwordChanged) {
          return res
            .status(StatusCodeEmums.UNAUTHORIZED)
            .json({ message: 'User Password changed' });
        }
        next();
      })
      .catch((error: any) => {
        return res
          .status(StatusCodeEmums.UNAUTHORIZED)
          .json({ message: 'Invalid token' });
      });
  } catch (error: any) {
    return res
      .status(StatusCodeEmums.UNAUTHORIZED)
      .json({ message: 'Invalid token' });
  }
};

export { authenticateToken };
