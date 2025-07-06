# Instantly MCP Server

A production-ready Model Context Protocol (MCP) server for Instantly.ai that provides AI assistants with access to Instantly's email marketing platform through standardized tools and real-time capabilities.

## Features

- **✅ Proper MCP Implementation**: Built with the official MCP SDK following the Model Context Protocol specification
- **🌐 SSE Support**: Server-Sent Events for real-time communication with Claude Desktop and other MCP clients
- **🔧 Tool-Based Architecture**: Each Instantly action is exposed as a named MCP tool for AI/automation compatibility
- **📡 Real-Time Broadcasting**: SSE streaming for tool results and webhook events
- **🔄 Bulletproof Retry Logic**: Exponential backoff for rate limiting and transient failures
- **📄 Comprehensive Pagination**: Handle large datasets efficiently
- **🚀 Railway Deployment**: One-click deployment to Railway with environment variable configuration
- **🔐 Environment-Based Configuration**: Secure API key management and customizable settings

## Quick Start

### Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "instantly-mcp-remote": {
      "command": "npx",
      "args": ["-y", "mcp-proxy", "--port", "3000", "node", "dist/mcp-server.js"],
      "env": {
        "INSTANTLY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Or connect to our hosted version:
- **SSE Endpoint**: `https://instantly-mcp-production.up.railway.app/sse`

### Local Development

1. **Clone and install:**
   ```bash
   git clone https://github.com/rees-bayba/instantly-mcp
   cd instantly-mcp
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env
   # Edit .env with your INSTANTLY_API_KEY
   ```

3. **Build and run:**
   ```bash
   npm run build
   npm run start:sse
   ```

4. **Test the connection:**
   ```bash
   curl -H "Accept: text/event-stream" http://localhost:3000/sse
   ```

## Available Tools

### Campaign Management
- `list_campaigns` - List all campaigns with optional filtering
- `create_campaign` - Create a new email campaign  
- `get_campaign` - Get details of a specific campaign
- `get_campaign_analytics` - Get analytics for a specific campaign

### Account Management
- `list_accounts` - List all email accounts

### Email Operations
- `send_email` - Send a single email
- `verify_email` - Verify an email address

### Lead Management
- `list_leads` - List leads from a campaign
- `create_lead` - Create a new lead
- `list_lead_lists` - List all lead lists

## Architecture

### MCP Server (`src/mcp-server.ts`)
- Implements the official Model Context Protocol specification
- Exposes Instantly API as standardized MCP tools
- Lazy-loads API credentials when tools are called
- Handles errors with proper MCP error codes

### SDK Layer (`src/sdk.ts`)
- `InstantlySDK` class with retry logic and pagination
- Exponential backoff for rate limiting
- Bulletproof pagination for list endpoints
- Environment variable configuration

### SSE Bridge (`start-sse-server.cjs`)
- Uses `mcp-proxy` to expose stdio MCP server via SSE
- Enables Claude Desktop and web client compatibility
- Handles process management and graceful shutdown

## Environment Variables

```bash
# Required
INSTANTLY_API_KEY=your_instantly_api_key_here

# Optional
INSTANTLY_API_URL=https://api.instantly.ai/api/v2
PORT=3000

# Retry Configuration
INSTANTLY_RETRY_MAX_ATTEMPTS=3
INSTANTLY_RETRY_INITIAL_DELAY=1000
INSTANTLY_RETRY_MAX_DELAY=10000
INSTANTLY_RETRY_BACKOFF_FACTOR=2
```

## Scripts

- `npm run build` - Compile TypeScript
- `npm run start` - Start SSE server (production)
- `npm run start:mcp` - Run MCP server directly (stdio)
- `npm run start:sse` - Start with SSE support
- `npm run start:legacy` - Start legacy HTTP server
- `npm run dev` - Build and start SSE server
- `npm run dev:legacy` - Build and start legacy server

## Deployment

### Railway (Recommended)

1. **One-click deploy:**
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

2. **Set environment variables:**
   - `INSTANTLY_API_KEY` - Your Instantly API key
   - `PORT` - Will be set automatically by Railway

3. **Access your endpoints:**
   - SSE: `https://your-app.up.railway.app/sse`
   - Health: `https://your-app.up.railway.app/health`

### Manual Deployment

```bash
# Build the project
npm run build

# Start the server
npm start
```

## Usage Examples

### With Claude Desktop

Once configured, you can use natural language commands:

```
"List all my email campaigns"
"Create a new campaign called 'Summer Sale' with subject 'Get 50% off!'"
"Show me analytics for campaign ID abc123"
"Add john@example.com to my lead list"
```

### Direct MCP Client

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client({ name: 'test-client', version: '1.0.0' });
const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/mcp-server.js']
});

await client.connect(transport);
const tools = await client.listTools();
console.log('Available tools:', tools);
```

## Troubleshooting

### Common Issues

1. **"INSTANTLY_API_KEY is required"**
   - Set the `INSTANTLY_API_KEY` environment variable
   - Check that your API key is valid and has proper permissions

2. **Connection timeout in Claude Desktop**
   - Verify the SSE endpoint is accessible: `curl -I https://your-app.up.railway.app/sse`
   - Check Railway logs for startup errors

3. **404 errors**
   - Ensure the server started successfully
   - Check that you're using the correct endpoint URLs

### Debug Mode

Run with debug logging:
```bash
DEBUG=1 npm run start:sse
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - The official MCP specification
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for MCP
- [mcp-proxy](https://github.com/punkpeye/mcp-proxy) - Proxy for exposing stdio MCP servers via HTTP/SSE 