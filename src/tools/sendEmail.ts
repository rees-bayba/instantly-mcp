import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function sendEmailHandler(req: Request, res: Response) {
  try {
    const emailData = req.body;
    const data = await sdk.sendEmail(emailData);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to send email', details: err.message });
  }
} 