import mongoose from 'mongoose';

const orderCounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 },
});

const OrderCounter = mongoose.model('OrderCounter', orderCounterSchema);

export default OrderCounter;
