import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface MatchScore {
  totalScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
}

export async function calculateMatchScore(resume: Resume, job: Job): Promise<MatchScore> {
  // Calculate individual scores
  const skillsScore = calculateSkillsMatch(resume.parsedData.keywords, job.skills);
  const experienceScore = calculateExperienceMatch(resume.parsedData.experience, job.description);
  const educationScore = calculateEducationMatch(resume.parsedData.education, job.description);

  // Calculate total score (weighted average)
  const totalScore = (skillsScore * 0.5 + experienceScore * 0.3 + educationScore * 0.2);

  return {
    totalScore,
    skillsScore,
    experienceScore,
    educationScore
  };
}

function calculateSkillsMatch(resumeKeywords: string[], jobSkills: string[]): number {
  const matchingSkills = resumeKeywords.filter(keyword => 
    jobSkills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
  );
  return (matchingSkills.length / jobSkills.length) * 100;
}

function calculateExperienceMatch(experience: any[], jobDescription: string): number {
  // Simple implementation - in reality, you'd want more sophisticated NLP
  const keywords = jobDescription.toLowerCase().split(' ');
  const relevantExperience = experience.filter(exp => 
    keywords.some(keyword => exp.description.toLowerCase().includes(keyword))
  );
  return (relevantExperience.length / experience.length) * 100;
}

function calculateEducationMatch(education: any[], jobDescription: string): number {
  // Simple implementation - in reality, you'd want more sophisticated matching
  const hasRelevantDegree = education.some(edu => 
    jobDescription.toLowerCase().includes(edu.degree.toLowerCase())
  );
  return hasRelevantDegree ? 100 : 0;
}

export async function getCachedMatchScore(resumeId: string, jobId: string): Promise<MatchScore | null> {
  const cacheKey = `match:${resumeId}:${jobId}`;
  const cachedScore = await redis.get(cacheKey);
  return cachedScore ? JSON.parse(cachedScore) : null;
}

export async function cacheMatchScore(resumeId: string, jobId: string, score: MatchScore): Promise<void> {
  const cacheKey = `match:${resumeId}:${jobId}`;
  await redis.set(cacheKey, JSON.stringify(score), 'EX', 3600); // Cache for 1 hour
}

export async function invalidateMatchScore(resumeId: string, jobId?: string): Promise<void> {
  if (jobId) {
    const cacheKey = `match:${resumeId}:${jobId}`;
    await redis.del(cacheKey);
  } else {
    // Invalidate all scores for this resume
    const keys = await redis.keys(`match:${resumeId}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
} 