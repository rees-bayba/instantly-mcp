import { Request, Response } from 'express';
import { broadcastEvent } from './sse';

const webhookHandler = (req: Request, res: Response) => {
  const event = req.body;
  console.log('Received webhook:', event);
  broadcastEvent('webhook', event);
  res.status(200).json({ status: 'ok' });
};

export default webhookHandler; 