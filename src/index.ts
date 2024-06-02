import mongoose, { ConnectOptions } from 'mongoose';

import logger from './utils/logger';
import { createApp } from './app';
import ErrorModel from './models/ErrorModel';

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!.toString(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    logger.log('info', 'Connected to MongoDB');

    const app = await createApp();
    app.listen(process.env.PORT, () => {
      logger.log('info', `App listening on port ${process.env.PORT}`);
    });
  } catch (error: any) {
    await new ErrorModel({
      level: 'error',
      message: error.message,
      code: 500,
      error,
    }).save();
    logger.log('error', `Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
})();
