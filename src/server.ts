import express from 'express';
import dotenv from 'dotenv';
import apiProxy from './apiProxy';
import webhookHandler from './webhook';
import { sseHandler, broadcastEvent } from './sse';
import { listCampaignsHandler } from './tools/listCampaigns';
import { createCampaignHandler } from './tools/createCampaign';
import { listAccountsHandler } from './tools/listAccounts';
import { getCampaignHandler } from './tools/getCampaign';
import { getCampaignAnalyticsHandler } from './tools/getCampaignAnalytics';
import { sendEmailHandler } from './tools/sendEmail';
import { verifyEmailHandler } from './tools/verifyEmail';
import { listLeadsHandler } from './tools/listLeads';
import { createLeadHandler } from './tools/createLead';
import { listLeadListsHandler } from './tools/listLeadLists';

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
app.get('/sse', sseHandler);

// Tool-based endpoints
app.post('/tools/list_campaigns', listCampaignsHandler);
app.post('/tools/create_campaign', createCampaignHandler);
app.post('/tools/list_accounts', listAccountsHandler);
app.post('/tools/get_campaign', getCampaignHandler);
app.post('/tools/get_campaign_analytics', getCampaignAnalyticsHandler);
app.post('/tools/send_email', sendEmailHandler);
app.post('/tools/verify_email', verifyEmailHandler);
app.post('/tools/list_leads', listLeadsHandler);
app.post('/tools/create_lead', createLeadHandler);
app.post('/tools/list_lead_lists', listLeadListsHandler);

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