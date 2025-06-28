import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  connection: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Connection',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ connection: 1, createdAt: 1 });

export default mongoose.model('Message', messageSchema); 