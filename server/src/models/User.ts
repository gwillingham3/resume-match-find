import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  resumeIds: [{
    type: Schema.Types.ObjectId, ref: 'Resume' 
  }],
  jobIds: [{ 
    type: Schema.Types.ObjectId, ref: 'Job'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema); 