import mongoose, { ConnectOptions } from 'mongoose';
import { redisClient } from './src/utils/redis';

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI!.toString(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
  jest.mock('redis', () => ({
    createClient: jest.fn().mockReturnValue({
      multi: jest.fn(),
      sAdd: jest.fn(),
      expire: jest.fn(),
      exec: jest.fn(),
      sIsMember: jest.fn(),
    }),
  }));
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
  jest.clearAllMocks();
});
