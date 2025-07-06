import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';

const sdk = new InstantlySDK();

export async function createCampaignHandler(req: Request, res: Response) {
  try {
    const { correlationId, ...campaignData } = req.body;
    const data = await sdk.createCampaign(campaignData);
    res.json(data);
    broadcastEvent('tool_result', {
      tool: 'create_campaign',
      params: campaignData,
      result: data,
      timestamp: Date.now(),
      correlationId,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create campaign', details: err.message });
  }
} 