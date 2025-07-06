import { Request, Response } from 'express';
import { InstantlySDK } from '../sdk';

const sdk = new InstantlySDK();

export async function verifyEmailHandler(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Missing email' });
    const data = await sdk.verifyEmail({ email });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to verify email', details: err.message });
  }
} 