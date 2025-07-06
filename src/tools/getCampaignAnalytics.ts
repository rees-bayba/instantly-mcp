import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function getCampaignAnalyticsHandler(req: Request, res: Response) {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Missing campaign id' });
    const data = await sdk.getCampaignAnalytics(id);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to get campaign analytics', details: err.message });
  }
} 