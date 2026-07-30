import { config } from '../config/env.js';

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
};

export const clearAuthCookies = (res) => {
  const options = getCookieOptions();

  res.clearCookie('accessToken', options);
  res.clearCookie('refreshToken', options);
};
