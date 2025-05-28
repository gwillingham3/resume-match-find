import express, { Request, Response } from 'express';
import { getYCJobs } from '../services/ycJobs';
import { cacheService } from '../services/redis';
const { get, set } = cacheService;
import { auth } from '../middleware/auth';
import { composeMiddleware } from '../middleware/compose';

const router = express.Router();

let cachedJobs: any[] = [];
let isFetchingJobs = false;

async function fetchAndCacheJobs() {
  if (isFetchingJobs) {
    console.log('Already fetching jobs, skipping this interval');
    return;
  }

  isFetchingJobs = true;
  try {
    const jobs = await getYCJobs();
    if (jobs) {
      cachedJobs = jobs;
      await set('yc_jobs', JSON.stringify(jobs));
      console.log('Jobs cached in memory and Redis');
    } else {
      console.error('Failed to fetch jobs from YC API');
    }
  } catch (error) {
    console.error('Error fetching and caching jobs:', error);
  } finally {
    isFetchingJobs = false;
  }
}

// Fetch and cache jobs every 15 minutes
setInterval(() => {
  fetchAndCacheJobs().catch(error => {
    console.error('Error in setInterval:', error);
  });
}, 15 * 60 * 1000);

router.get('/', auth, 
  composeMiddleware({
    methods: ['GET'],
    requireAuth: true,
    rateLimit: {
      windowMs: 60000,
      max: 20,
    },
  }),
  async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 20, search = '', sort = 'newest' } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    let jobs = cachedJobs;

    if (!jobs || jobs.length === 0) {
      console.log('No jobs in memory, fetching from YC API');
      await fetchAndCacheJobs();
      jobs = cachedJobs;
      if (!jobs || jobs.length === 0) {
        res.status(500).json({ error: 'Failed to fetch jobs from YC API' });
        return;
      }
    }

    // Search
    if (search) {
      jobs = jobs.filter(job =>
        job.title.toLowerCase().includes((search as string).toLowerCase()) ||
        job.company.toLowerCase().includes((search as string).toLowerCase()) ||
        job.description.toLowerCase().includes((search as string).toLowerCase())
      );
    }

    // Sort
    switch (sort) {
      case 'newest':
        jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        jobs.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      default:
        jobs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    // Pagination
    const startIndex = (pageNumber - 1) * limitNumber;
    const endIndex = pageNumber * limitNumber;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      jobs: paginatedJobs,
      page: pageNumber,
      totalPages: Math.ceil(jobs.length / limitNumber),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
