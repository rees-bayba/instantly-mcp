import express from 'express';
import dotenv from 'dotenv';
import apiProxy from './apiProxy';
import webhookHandler from './webhook';
import { sseHandler, broadcastEvent } from './sse';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing
app.use(express.json());

// API Proxy for Instantly
app.use('/api', apiProxy);

// Webhook endpoint
app.post('/webhook', webhookHandler);

// SSE endpoint
app.get('/events', sseHandler);

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Instantly MCP server running on port ${PORT}`);
}); 