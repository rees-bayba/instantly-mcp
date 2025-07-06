import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';

const sdk = new InstantlySDK();

export async function listCampaignsHandler(req: Request, res: Response) {
  try {
    const { filters = {}, pagination = {}, correlationId } = req.body || {};
    const params = { ...filters, ...pagination };
    const data = await sdk.listCampaigns(params);
    res.json(data);
    broadcastEvent('tool_result', {
      tool: 'list_campaigns',
      params,
      result: data,
      timestamp: Date.now(),
      correlationId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list campaigns', details: err.message });
  }
} 