import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    key: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    badge: { type: String, required: true, trim: true },
    unlockedAt: { type: Date, default: Date.now },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', default: null },
  },
  { timestamps: true }
);

achievementSchema.index({ user: 1, key: 1 }, { unique: true });

achievementSchema.methods.toJSON = function () {
  const achievement = this.toObject();
  delete achievement.__v;
  return achievement;
};

const Achievement = mongoose.model('Achievement', achievementSchema);

export default Achievement;
