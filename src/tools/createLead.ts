import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';

const sdk = new InstantlySDK();

export async function createLeadHandler(req: Request, res: Response) {
  try {
    const { correlationId, ...leadData } = req.body;
    const data = await sdk.createLead(leadData);
    res.json(data);
    broadcastEvent('tool_result', {
      tool: 'create_lead',
      params: leadData,
      result: data,
      timestamp: Date.now(),
      correlationId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create lead', details: err.message });
  }
} 