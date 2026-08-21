import mongoose from 'mongoose';

const platformSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, enum: ['platform'], default: 'platform', unique: true, immutable: true },
  platformName: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  platformDescription: { type: String, trim: true, maxlength: 300, default: '' },
  supportEmail: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  supportPhone: { type: String, trim: true, maxlength: 30, default: '', match: /^[+\d][\d\s()+.-]*$|^$/ },
  registrationEnabled: { type: Boolean, required: true, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

export default mongoose.model('PlatformSetting', platformSettingSchema);
