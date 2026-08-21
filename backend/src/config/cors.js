import { config } from './env.js';

const parseOrigins = (urlString) => {
  return urlString
    .split(',')
    .map(url => url.trim())
    .filter(Boolean);
};

export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = parseOrigins(config.CLIENT_URL);

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  maxAge: 3600,
};
