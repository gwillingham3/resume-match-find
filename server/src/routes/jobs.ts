import express, { Request, Response } from 'express';
import { getYCJobs } from '../services/ycJobs';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const jobs = await getYCJobs();
    if (jobs) {
      res.json(jobs);
    } else {
      res.status(500).json({ error: 'Failed to fetch jobs from YC API' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
