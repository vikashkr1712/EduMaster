import app from './app.js';
import { config } from './config/env.js';
import { connectDB, closeDB } from './config/db.js';
import { logger } from './utils/logger.js';

let server;

const startServer = async () => {
  try {
    await connectDB();
    logger.log('Database connected');

    server = app.listen(config.PORT, () => {
      logger.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.log(`${signal} received, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      logger.log('HTTP server closed');
      await closeDB();
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after 10 seconds');
      process.exit(1);
    }, 10000);
  } else {
    await closeDB();
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

startServer();
