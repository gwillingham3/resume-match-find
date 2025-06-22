import { Resume } from '../models/Resume';
import { Job } from '../models/Job';
import { Document } from 'mongoose';
import { cacheService } from './redis';

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
  try {
    const cacheKey = `match:${resumeId}:${jobId}`;
    const cachedScore = await cacheService.get(cacheKey);
    return cachedScore ? JSON.parse(cachedScore) : null;
  } catch (err) {
    console.warn('Error getting cached score:', err);
    return null;
  }
}

export async function cacheMatchScore(resumeId: string, jobId: string, score: MatchScore): Promise<void> {
  try {
    const cacheKey = `match:${resumeId}:${jobId}`;
    await cacheService.set(cacheKey, JSON.stringify(score), 3600); // Cache for 1 hour
  } catch (err) {
    console.warn('Error caching score:', err);
  }
}

export async function invalidateMatchScore(resumeId: string, jobId?: string): Promise<void> {
  try {
    if (jobId) {
      const cacheKey = `match:${resumeId}:${jobId}`;
      await cacheService.del(cacheKey);
    } else {
      // Invalidate all scores for this resume
      // This functionality is not implemented because cacheService doesn't have a keys method.
      // console.warn('Invalidate all scores for this resume is not implemented');
    }
  } catch (err) {
    console.warn('Error invalidating cache:', err);
  }
}
