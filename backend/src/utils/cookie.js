import { config } from '../config/env.js';
import { randomBytes } from 'node:crypto';

const getCookieOptions = () => {
  const isProduction = config.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
    ...(config.COOKIE_DOMAIN && { domain: config.COOKIE_DOMAIN }),
  };
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const options = getCookieOptions();

  res.cookie('accessToken', accessToken, {
    ...options,
    maxAge: config.ACCESS_COOKIE_MAX_AGE,
  });

  res.cookie('refreshToken', refreshToken, {
    ...options,
    maxAge: config.REFRESH_COOKIE_MAX_AGE,
  });
  setCsrfCookie(res);
};

export const setCsrfCookie = (res) => {
  const options = getCookieOptions();
  const token = randomBytes(24).toString('hex');
  res.cookie('csrfToken', token, {
    ...options,
    httpOnly: false,
    maxAge: config.REFRESH_COOKIE_MAX_AGE,
  });
  return token;
};

export const clearAuthCookies = (res) => {
  const options = getCookieOptions();

  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
  res.clearCookie('csrfToken', { ...options, httpOnly: false });
};
