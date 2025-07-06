import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';

const sdk = new InstantlySDK();

export async function listLeadListsHandler(req: Request, res: Response) {
  try {
    const { filters = {}, pagination = {}, correlationId } = req.body || {};
    const params = { ...filters, ...pagination };
    const data = await sdk.listLeadLists(params);
    res.json(data);
    broadcastEvent('tool_result', {
      tool: 'list_lead_lists',
      params,
      result: data,
      timestamp: Date.now(),
      correlationId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list lead lists', details: err.message });
  }
} 