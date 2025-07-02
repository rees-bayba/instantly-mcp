import { Request, Response } from 'express';

interface SSEClient {
  id: number;
  res: Response;
}

let clients: SSEClient[] = [];
let clientId = 0;

export function sseHandler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const id = ++clientId;
  clients.push({ id, res });

  // Heartbeat
  const heartbeat = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeat);
    clients = clients.filter(c => c.id !== id);
  });
}

export function broadcastEvent(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach(c => c.res.write(payload));
} 