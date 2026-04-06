import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/healthcheck', (_req:Request, res:Response) => {
  res.status(200).json({ success: true, message: 'API is running' });
})

export default router