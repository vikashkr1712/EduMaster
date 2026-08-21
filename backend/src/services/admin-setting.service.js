import PlatformSetting from '../models/PlatformSetting.js';

export const PLATFORM_SETTING_DEFAULTS = Object.freeze({
  platformName: 'EduMaster',
  platformDescription: 'Learn. Grow. Succeed.',
  supportEmail: 'support@edumaster.com',
  supportPhone: '',
  registrationEnabled: true,
});

const safeSettings = (settings) => ({
  platformName: settings.platformName,
  platformDescription: settings.platformDescription,
  supportEmail: settings.supportEmail,
  supportPhone: settings.supportPhone,
  registrationEnabled: settings.registrationEnabled,
});

export const getEffectivePlatformSettings = async () => {
  const stored = await PlatformSetting.findOne({ key: 'platform' }).lean();
  return stored ? { ...PLATFORM_SETTING_DEFAULTS, ...safeSettings(stored) } : { ...PLATFORM_SETTING_DEFAULTS };
};

export const getAdminSettings = async () => {
  const stored = await PlatformSetting.findOne({ key: 'platform' })
    .populate('updatedBy', 'name')
    .lean();
  return {
    settings: stored ? { ...PLATFORM_SETTING_DEFAULTS, ...safeSettings(stored) } : { ...PLATFORM_SETTING_DEFAULTS },
    metadata: {
      persisted: Boolean(stored),
      updatedAt: stored?.updatedAt ?? null,
      updatedBy: stored?.updatedBy ? { _id: stored.updatedBy._id, name: stored.updatedBy.name } : null,
    },
  };
};

export const updateAdminSettings = async (input, adminId) => {
  const allowed = {
    platformName: input.platformName,
    platformDescription: input.platformDescription,
    supportEmail: input.supportEmail,
    supportPhone: input.supportPhone,
    registrationEnabled: input.registrationEnabled,
    updatedBy: adminId,
  };
  await PlatformSetting.findOneAndUpdate(
    { key: 'platform' },
    { $set: allowed, $setOnInsert: { key: 'platform' } },
    { upsert: true, returnDocument: 'after', runValidators: true, setDefaultsOnInsert: true }
  );
  return getAdminSettings();
};
