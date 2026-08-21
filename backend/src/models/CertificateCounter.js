import mongoose from 'mongoose';

const certificateCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 },
});

const CertificateCounter = mongoose.model('CertificateCounter', certificateCounterSchema);

export default CertificateCounter;
