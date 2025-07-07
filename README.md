# Instantly MCP Server

A comprehensive Model Context Protocol (MCP) server for Instantly.ai that provides AI assistants with complete access to Instantly's email marketing platform through 49 standardized tools and real-time capabilities.

## 🚀 Features

- **✅ Complete Instantly.ai Coverage**: 49 tools covering all major API endpoints
- **📧 Full Email Workflow**: Send, reply, track, and manage email conversations
- **📊 Advanced Analytics**: Daily, step-by-step, and overview campaign analytics
- **🔄 Subsequence Automation**: Create, manage, and optimize follow-up sequences
- **🎯 Lead Management**: Comprehensive CRUD operations for leads and lists
- **🌐 SSE Support**: Server-Sent Events for real-time communication
- **🔧 Tool-Based Architecture**: Each action exposed as standardized MCP tools
- **🔄 Bulletproof Retry Logic**: Exponential backoff for rate limiting
- **🚀 Railway Deployment**: Production-ready hosted deployment
- **🔐 Environment-Based Configuration**: Secure API key management

## 🎯 Available Tools (49 Total)

### 📧 Email Management (6 tools)
- `reply_to_email` - Reply to emails in conversation threads
- `get_email` - Get detailed email content and metadata
- `list_emails` - List emails with advanced filtering options
- `update_email` - Update email properties and status
- `delete_email` - Delete emails from the system
- `count_unread_emails` - Count unread emails across accounts
- `mark_thread_as_read` - Mark entire conversation threads as read

### 🎯 Campaign Management (8 tools)
- `list_campaigns` - List all campaigns with filtering and pagination
- `create_campaign` - Create new email campaigns with sequences
- `get_campaign` - Get detailed campaign information and settings
- `update_campaign` - Modify existing campaign parameters
- `activate_campaign` - Start or resume campaign execution
- `pause_campaign` - Pause active campaigns
- `delete_campaign` - Remove campaigns from the system
- `send_email` - Send individual emails through campaigns

### 📊 Advanced Analytics (4 tools)
- `get_campaign_analytics` - Comprehensive campaign performance metrics
- `get_campaign_analytics_overview` - High-level analytics across campaigns
- `get_daily_campaign_analytics` - Day-by-day performance tracking
- `get_campaign_steps_analytics` - Step-by-step sequence performance analysis

### 🔄 Subsequence Management (8 tools)
- `create_subsequence` - Create advanced follow-up automation sequences
- `list_subsequences` - List all subsequences with filtering
- `get_subsequence` - Get detailed subsequence configuration
- `update_subsequence` - Modify subsequence settings and steps
- `delete_subsequence` - Remove subsequences from campaigns
- `duplicate_subsequence` - Clone successful subsequences
- `pause_subsequence` - Pause subsequence execution
- `resume_subsequence` - Resume paused subsequences

### 👥 Lead & List Management (11 tools)
- `list_leads` - List leads with advanced filtering and pagination
- `create_lead` - Add new leads to campaigns
- `get_lead` - Get individual lead details and history
- `update_lead` - Modify lead information and custom fields
- `delete_lead` - Remove leads from the system
- `move_leads` - Transfer leads between campaigns or lists
- `merge_leads` - Combine duplicate lead records
- `update_lead_interest_status` - Track lead engagement levels
- `remove_lead_from_subsequence` - Remove leads from automation sequences
- `list_lead_lists` - List all lead lists and collections
- `create_lead_list` - Create new lead lists for organization
- `get_lead_list` - Get lead list details and statistics
- `update_lead_list` - Modify lead list properties
- `delete_lead_list` - Remove lead lists

### 🔧 Account Management (8 tools)
- `list_accounts` - List all email sending accounts
- `create_account` - Add new email accounts for sending
- `get_account` - Get detailed account information and status
- `update_account` - Modify account settings and configuration
- `delete_account` - Remove accounts from the workspace
- `pause_account` - Temporarily disable account sending
- `resume_account` - Re-enable paused accounts
- `get_warmup_analytics` - Get account warmup performance data

### 🔑 API & System Management (4 tools)
- `list_api_keys` - List all API keys and their permissions
- `create_api_key` - Generate new API keys with custom scopes
- `delete_api_key` - Revoke API key access
- `verify_email` - Verify email addresses for deliverability

## 🚀 Quick Start

### Claude Desktop Configuration

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "instantly-mcp": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-stdio", "node", "dist/mcp-server.js"],
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

## 💡 Usage Examples

### Email Workflow Automation
```
"Reply to the latest email from john@example.com with a follow-up message"
"Show me all unread emails from my Q4 campaign"
"Mark all emails in thread abc123 as read"
"Get the email content for email ID xyz789"
```

### Campaign Management
```
"Create a new campaign called 'Holiday Sale' with a 3-step sequence"
"Show me analytics for all campaigns from last month"
"Pause the 'Summer Outreach' campaign"
"Get daily performance data for campaign abc123"
```

### Lead Intelligence
```
"Move all interested leads from Campaign A to Campaign B"
"Update lead john@company.com interest status to 'meeting_booked'"
"Show me all leads that haven't been contacted yet"
"Merge duplicate leads for company.com domain"
```

### Subsequence Optimization
```
"Create a follow-up subsequence for leads who opened but didn't reply"
"Duplicate the highest-performing subsequence from Q3"
"Show me step-by-step analytics for subsequence xyz789"
"Pause all subsequences with reply rates below 5%"
```

### Advanced Analytics
```
"Show me daily campaign performance for the last 30 days"
"Compare step-by-step performance across all active campaigns"
"Get overview analytics for all campaigns this quarter"
"Which campaign steps have the highest reply rates?"
```

## 🏗️ Architecture

### MCP Server (`src/mcp-server.ts`)
- Implements the official Model Context Protocol specification
- 49 standardized tools covering complete Instantly.ai functionality
- Proper error handling with MCP error codes
- Input validation and parameter checking

### SDK Layer (`src/sdk.ts`)
- Comprehensive `InstantlySDK` class with full API coverage
- Exponential backoff retry logic for reliability
- Intelligent pagination for large datasets
- Environment variable configuration

### SSE Bridge (`start-sse-server.cjs`)
- Server-Sent Events support for real-time communication
- Claude Desktop and web client compatibility
- Process management and graceful shutdown

## 🌐 Environment Variables

```bash
# Required
INSTANTLY_API_KEY=your_instantly_api_key_here

# Optional
INSTANTLY_API_URL=https://api.instantly.ai/api/v2
PORT=3000

# Retry Configuration (Advanced)
INSTANTLY_RETRY_MAX_ATTEMPTS=3
INSTANTLY_RETRY_INITIAL_DELAY=1000
INSTANTLY_RETRY_MAX_DELAY=10000
INSTANTLY_RETRY_BACKOFF_FACTOR=2
```

## 📜 Scripts

- `npm run build` - Compile TypeScript to production-ready JavaScript
- `npm run start` - Start SSE server (production mode)
- `npm run start:mcp` - Run MCP server directly (stdio)
- `npm run start:sse` - Start with SSE support for web clients
- `npm run dev` - Build and start SSE server in development
- `npm test` - Run test suite (if available)

## 🚀 Deployment

### Railway (Recommended)

1. **One-click deploy:**
   ```bash
   # Fork the repository, then deploy to Railway
   # Set INSTANTLY_API_KEY in Railway environment variables
   ```

2. **Your endpoints:**
   - SSE: `https://your-app.up.railway.app/sse`
   - Health: `https://your-app.up.railway.app/health`

### Manual Deployment

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## 🔧 Advanced Features

### Email Thread Management
- Complete conversation tracking with `thread_id`
- Reply chain analysis and management
- Automated thread status updates

### Campaign Intelligence
- A/B testing support at step level
- Performance-based sequence optimization
- Automated campaign scaling capabilities

### Lead Scoring & Management
- Interest status tracking and updates
- Lead lifecycle management
- Duplicate detection and merging

### Analytics & Reporting
- Real-time campaign performance monitoring
- Historical trend analysis
- ROI and conversion tracking

## 🐛 Troubleshooting

### Common Issues

1. **"INSTANTLY_API_KEY is required"**
   - Set the environment variable in your configuration
   - Verify your API key has proper permissions

2. **Tool execution failures**
   - Check API key scopes match tool requirements
   - Verify network connectivity to Instantly.ai

3. **SSE connection issues**
   - Test endpoint: `curl -I https://your-app.up.railway.app/sse`
   - Check Railway deployment logs

### Debug Mode

```bash
DEBUG=1 npm run start:sse
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🔗 Related Projects

- [Model Context Protocol](https://modelcontextprotocol.io/) - Official MCP specification
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk) - TypeScript SDK for MCP
- [Instantly.ai](https://instantly.ai/) - Email marketing automation platform

## 📈 Changelog

### v2.0.0 - Major Expansion (Latest)
- **Expanded from 22 to 49 tools** (123% increase!)
- Added complete email workflow management
- Added advanced analytics and reporting
- Added subsequence automation tools
- Added comprehensive lead management
- Enhanced campaign control capabilities
- Improved error handling and validation

### v1.0.0 - Initial Release
- Basic MCP implementation with core tools
- SSE support for real-time communication
- Railway deployment configuration 