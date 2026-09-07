const DATA_AVATAR_PREFIX = 'data:image/';

export const avatarPath = (userId, updatedAt) => {
  const timestamp = updatedAt ? new Date(updatedAt).getTime() : 0;
  const version = Number.isFinite(timestamp) && timestamp > 0 ? `?v=${timestamp}` : '';
  return `/api/v1/users/${userId}/avatar${version}`;
};

export const toAvatarReference = (user) => {
  if (!user || typeof user !== 'object') return user;
  if (typeof user.avatar !== 'string' || !user.avatar.startsWith(DATA_AVATAR_PREFIX)) return user;
  return { ...user, avatar: avatarPath(user._id, user.updatedAt) };
};

export const avatarReferenceExpression = (
  idExpression = '$_id',
  avatarExpression = '$avatar',
  updatedAtExpression = '$updatedAt'
) => ({
  $cond: [
    { $regexMatch: { input: { $ifNull: [avatarExpression, ''] }, regex: /^data:image\//i } },
    {
      $concat: [
        '/api/v1/users/',
        { $toString: idExpression },
        '/avatar?v=',
        { $toString: { $ifNull: [{ $toLong: updatedAtExpression }, 0] } },
      ],
    },
    avatarExpression,
  ],
});
