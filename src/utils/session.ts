import { verifyToken } from './jwt';
import { redisClient } from './redis';

export async function storeSession(userId: string, token: string) {
  const key = `session:${userId}`;
  const sessionData = JSON.stringify({ userId, token });
  await redisClient.set(key, sessionData);
  return redisClient.expire(key, 9000);
}

export async function getSession(userId: string) {
  const key = `session:${userId}`;
  const sessionData = await redisClient.get(key);
  return sessionData ? JSON.parse(sessionData || '{}') : null;
}

export async function removeSession(userId: string) {
  const key = `session:${userId}`;
  const sessionData = await redisClient.get(key);
  await redisClient.del(key);

  const parsedSessionData = JSON.parse(sessionData || '{}');
  const tokenExpireTime = verifyToken(parsedSessionData.token).exp;
  const currentTime = Math.floor(Date.now() / 1000);
  const ttl = (tokenExpireTime as number) - currentTime;

  try {
    return redisClient
      .multi()
      .sAdd('jwt-blacklisted-tokens', parsedSessionData.token)
      .expire('jwt-blacklisted-tokens', ttl)
      .exec();
  } catch (error) {
    return 'Server Error';
  }
}
