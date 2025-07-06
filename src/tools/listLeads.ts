import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function listLeadsHandler(req: Request, res: Response) {
  try {
    const { filters = {}, pagination = {} } = req.body || {};
    const params = { ...filters, ...pagination };
    const data = await sdk.listLeads(params);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list leads', details: err.message });
  }
} 