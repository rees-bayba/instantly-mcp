import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function createCampaignHandler(req: Request, res: Response) {
  try {
    const campaignData = req.body;
    const data = await sdk.createCampaign(campaignData);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create campaign', details: err.message });
  }
} 