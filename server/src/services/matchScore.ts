import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { Document } from 'mongoose';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface MatchScore {
  totalScore: number;
  skillsScore: number;
}

export async function calculateMatchScore(resume: Resume, job: Document & { skills: string[] }): Promise<MatchScore> {
  // Calculate skills match score
  const skillsScore = calculateSkillsMatch(resume.parsedData.keywords, job.skills);

  return {
    totalScore: skillsScore,
    skillsScore
  };
}

function calculateSkillsMatch(resumeKeywords: string[], jobSkills: string[]): number {
  if (!jobSkills.length) return 0;
  
  const matchingSkills = resumeKeywords.filter(keyword => 
    jobSkills.some(skill => skill.toLowerCase().includes(keyword.toLowerCase()))
  );
  return (matchingSkills.length / jobSkills.length) * 100;
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