import mongoose, { Document } from 'mongoose';
import redisClient from '../config/redis';
import multer from 'multer';

// Interface for Resume document
interface Resume {
  userId: mongoose.Types.ObjectId;
  file: {
    data: string; // Changed type to string
    filename: string;
    contentType: string;
    size: number;
  };
  parsedData: {
    keywords: string[];
    skills: string[];
    education: Array<{
      institution: string;
      degree: string;
      field: string;
      startDate: Date;
      endDate: Date | null;
    }>;
    experience: Array<{
      company: string;
      position: string;
      location: string;
      startDate: Date;
      endDate: Date | null;
      description: string;
    }>;
    personalInfo: {
      name: string;
      email: string;
      phone?: string;
      location?: string;
      linkedIn?: string;
      github?: string;
      portfolio?: string;
    };
  };
  status: {
    isProcessed: boolean;
    processingErrors?: string[];
    lastProcessed: Date;
  };
  metadata: {
    uploadedAt: Date;
    lastUpdated: Date;
    version: number;
  };
  settings: {
    isPublic: boolean;
    allowKeywordExtraction: boolean;
    preferredJobTypes: string[];
    preferredLocations: string[];
    minimumSalary?: number;
  };
  jobPreferences: {
    desiredRole: string[];
    desiredIndustries: string[];
    workType: string[]; // ['remote', 'hybrid', 'onsite']
    experienceLevel: string; // ['entry', 'mid', 'senior', 'executive']
  };
  applications: Array<{
    jobId: mongoose.Types.ObjectId;
    appliedAt: Date;
    status: string; // ['pending', 'viewed', 'interviewing', 'rejected', 'accepted']
    notes?: string;
  }>;
}

interface AppContext {
  models: {
    Job: any;
  };
}

// Resume Schema
const ResumeSchema = new mongoose.Schema<Resume>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  file: {
    data: {
      type: String, // Changed type to string
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
    size: {
      type: Number,
      required: true
    },
  },
  parsedData: {
    keywords: [{
      type: String,
      index: true,
    }],
    skills: [{
      type: String,
      index: true,
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: Date,
      endDate: Date,
    }],
    experience: [{
      company: String,
      position: String,
      location: String,
      startDate: Date,
      endDate: Date,
      description: String,
    }],
    personalInfo: {
      name: String,
      email: {
        type: String,
        lowercase: true,
      },
      phone: String,
      location: String,
      linkedIn: String,
      github: String,
      portfolio: String,
    },
  },
  status: {
    isProcessed: {
      type: Boolean,
      default: false,
    },
    processingErrors: [String],
    lastProcessed: Date,
  },
  metadata: {
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  settings: {
    isPublic: {
      type: Boolean,
      default: false,
    },
    allowKeywordExtraction: {
      type: Boolean,
      default: true,
    },
    preferredJobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
    }],
    preferredLocations: [String],
    minimumSalary: Number,
  },
  jobPreferences: {
    desiredRole: [String],
    desiredIndustries: [String],
    workType: [{
      type: String,
      enum: ['remote', 'hybrid', 'onsite'],
    }],
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'executive'],
    },
  },
  applications: [{
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'viewed', 'interviewing', 'rejected', 'accepted'],
      default: 'pending',
    },
    notes: String,
  }],
}, {
  timestamps: true,
});

// Indexes
ResumeSchema.index({ 'parsedData.keywords': 1 });
ResumeSchema.index({ 'parsedData.skills': 1 });
ResumeSchema.index({ 'metadata.uploadedAt': -1 });
ResumeSchema.index({ 'applications.appliedAt': -1 });

// Pre-save middleware to update lastUpdated
ResumeSchema.pre('save', function(next) {
  this.metadata.lastUpdated = new Date();
  next();
});

// Virtual for file URL (if you're storing files in a cloud service)
ResumeSchema.virtual('fileUrl').get(function() {
  return `/api/resumes/${this._id}/download`;
});

// Methods
ResumeSchema.methods.updateMatchScore = async function(jobId: string) {
  // Implement job matching score calculation logic
  // This would compare resume data with job requirements
  return this.matchScore;
};

ResumeSchema.methods.addApplication = async function(jobId: string) {
  if (!this.applications.some((app: { jobId: { toString: () => string } }) => app.jobId.toString() === jobId)) {
    this.applications.push({
      jobId: new mongoose.Types.ObjectId(jobId),
      appliedAt: new Date(),
      status: 'pending',
    });
    await this.save();
  }
};

// Static methods
ResumeSchema.statics.findByKeywords = async function(keywords: string[]) {
  return this.find({
    'parsedData.keywords': { $in: keywords },
  }).sort({ 'matchScore.totalScore': -1 });
};

// Add proper type for app parameter and ensure return value
ResumeSchema.methods.calculateMatchScore = async function(app: AppContext): Promise<number> {
  // ... existing code ...
  return this.matchScore.totalScore;
};

// Create and export the model
const ResumeModel = mongoose.model<Resume>('Resume', ResumeSchema);
export default ResumeModel;
export type { Resume };

const storage = multer.memoryStorage();
const upload = multer({ storage });
