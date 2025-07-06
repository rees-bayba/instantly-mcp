import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function createLeadHandler(req: Request, res: Response) {
  try {
    const leadData = req.body;
    const data = await sdk.createLead(leadData);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create lead', details: err.message });
  }
} 