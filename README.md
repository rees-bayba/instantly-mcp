# Instantly MCP Server

A robust, production-ready Master Control Program (MCP) server for Instantly, deployable on Railway, with full API proxying, webhook, and real-time SSE event streaming support.

---

## Features

- **Universal API Proxy:**
  - Proxies all Instantly API endpoints via `/api/*`.
  - Automatically injects API key and handles all HTTP methods.
- **Webhook Listener:**
  - Receives Instantly webhook events at `/webhook`.
  - Broadcasts events to all connected SSE clients.
- **SSE Event Stream:**
  - `/events` endpoint streams real-time events to clients.
  - Heartbeats and reconnection support.
- **Polling Fallback:**
  - (Optional) Polls Instantly endpoints for updates if webhooks are not available.
- **Security:**
  - API key stored in environment variables.
  - Optional authentication for MCP endpoints.
- **Dockerized:**
  - Ready for Railway deployment.
- **TypeScript:**
  - Type safety and maintainability.

---

## Project Structure

```
/instantly-mcp
  /src
    apiProxy.ts         # Express proxy middleware for Instantly API
    webhook.ts          # Webhook endpoint logic
    sse.ts              # SSE connection and broadcast logic
    polling.ts          # (Optional) Polling logic for endpoints without webhooks
    server.ts           # App entry point
  /test
    ...                 # Tests
  Dockerfile
  package.json
  .env.example
  README.md
```

---

## Setup

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your-org/instantly-mcp.git
   cd instantly-mcp
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Instantly API key and other settings.
4. **Run locally:**
   ```sh
   npm run dev
   ```
5. **Test endpoints:**
   - Proxy: `GET /api/campaigns`
   - SSE: `GET /events`
   - Webhook: `POST /webhook`

---

## Railway Deployment

1. **Push to GitHub.**
2. **Create a new Railway project.**
3. **Connect your GitHub repo.**
4. **Set environment variables in Railway dashboard:**
   - `INSTANTLY_API_KEY` (and any others needed)
5. **Deploy!**

---

## License

MIT 

## Environment Variables

See [.env.example](./.env.example) for all required and optional environment variables.

- `INSTANTLY_API_KEY` (required): Your Instantly API key
- `INSTANTLY_API_URL` (optional): Custom Instantly API URL (default: https://api.instantly.ai/api/v2)
- `INSTANTLY_RETRY_MAX_ATTEMPTS` (optional): Max retry attempts (default: 3)
- `INSTANTLY_RETRY_INITIAL_DELAY` (optional): Initial retry delay in ms (default: 1000)
- `INSTANTLY_RETRY_MAX_DELAY` (optional): Max retry delay in ms (default: 10000)
- `INSTANTLY_RETRY_BACKOFF_FACTOR` (optional): Retry backoff factor (default: 2)
- `PORT` (optional): Port to run the server on (Railway sets this automatically)

## SSE Endpoint for Claude Desktop

To integrate with Claude Desktop, use the `/sse` endpoint:

```
https://your-app.up.railway.app/sse
```

**Important:** You must include `/sse` at the end of the URL in Claude Desktop's integration settings.

## Retry Logic

The server includes automatic retry logic with exponential backoff to handle Instantly API rate limits gracefully. You can configure retry behavior using the environment variables above. 