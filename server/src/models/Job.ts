import mongoose, { Schema } from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { 
    type: Schema.Types.ObjectId, ref: 'User'
  },
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: String,
  type: String,
  description: String,
  skills: [String],
  salary: String,
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Job = mongoose.model('Job', jobSchema); 