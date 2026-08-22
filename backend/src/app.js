import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'node:path';

import { corsOptions } from './config/cors.js';
import { config } from './config/env.js';
import { morganStream, logger } from './utils/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import { csrfProtection } from './middleware/csrfProtection.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '3mb', type: ['application/json', 'application/*+json'] }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use('/uploads', express.static(path.resolve('uploads'), {
  // The SPA is served from a different development origin, so uploaded
  // media must be allowed as cross-origin image resources.
  setHeaders(res) {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

const morganFormat = config.NODE_ENV === 'development' ? 'dev' : 'combined';
app.use(morgan(morganFormat, { stream: morganStream }));

app.use('/api', globalLimiter);
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});
app.use('/api/v1', csrfProtection);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduMaster API is running',
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
