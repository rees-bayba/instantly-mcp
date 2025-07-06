import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
  CallToolRequest,
} from '@modelcontextprotocol/sdk/types.js';
import { InstantlySDK } from './sdk.js';

// Initialize the MCP server
const server = new Server(
  {
    name: 'instantly-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Function to get SDK instance (lazy initialization)
function getSDK(): InstantlySDK {
  const apiKey = process.env.INSTANTLY_API_KEY;
  if (!apiKey) {
    throw new McpError(
      ErrorCode.InvalidParams,
      'INSTANTLY_API_KEY environment variable is required'
    );
  }
  return new InstantlySDK(
    apiKey,
    process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2'
  );
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_campaigns',
        description: 'List all campaigns with optional filtering',
        inputSchema: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Filter by campaign status (active, paused, etc.)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of campaigns to return',
            },
            offset: {
              type: 'number',
              description: 'Number of campaigns to skip for pagination',
            },
          },
        },
      },
      {
        name: 'create_campaign',
        description: 'Create a new email campaign',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Campaign name',
            },
            subject: {
              type: 'string',
              description: 'Email subject line',
            },
            body: {
              type: 'string',
              description: 'Email body content',
            },
          },
          required: ['name', 'subject', 'body'],
        },
      },
      {
        name: 'list_accounts',
        description: 'List all email accounts',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of accounts to return',
            },
            offset: {
              type: 'number',
              description: 'Number of accounts to skip for pagination',
            },
          },
        },
      },
      {
        name: 'get_campaign',
        description: 'Get details of a specific campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Campaign ID',
            },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'get_campaign_analytics',
        description: 'Get analytics for a specific campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Campaign ID',
            },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'send_email',
        description: 'Send a single email',
        inputSchema: {
          type: 'object',
          properties: {
            to: {
              type: 'string',
              description: 'Recipient email address',
            },
            subject: {
              type: 'string',
              description: 'Email subject',
            },
            body: {
              type: 'string',
              description: 'Email body',
            },
            from: {
              type: 'string',
              description: 'Sender email address',
            },
          },
          required: ['to', 'subject', 'body', 'from'],
        },
      },
      {
        name: 'verify_email',
        description: 'Verify an email address',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address to verify',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'list_leads',
        description: 'List leads from a campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Campaign ID',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of leads to return',
            },
            offset: {
              type: 'number',
              description: 'Number of leads to skip for pagination',
            },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'create_lead',
        description: 'Create a new lead',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Lead email address',
            },
            firstName: {
              type: 'string',
              description: 'Lead first name',
            },
            lastName: {
              type: 'string',
              description: 'Lead last name',
            },
            campaignId: {
              type: 'string',
              description: 'Campaign ID to add lead to',
            },
          },
          required: ['email', 'campaignId'],
        },
      },
      {
        name: 'list_lead_lists',
        description: 'List all lead lists',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of lead lists to return',
            },
            offset: {
              type: 'number',
              description: 'Number of lead lists to skip for pagination',
            },
          },
        },
      },
      {
        name: 'create_lead_list',
        description: 'Create a new lead list',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Lead list name',
            },
            description: {
              type: 'string',
              description: 'Lead list description',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'update_campaign',
        description: 'Update an existing campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Campaign ID to update',
            },
            name: {
              type: 'string',
              description: 'Campaign name',
            },
            subject: {
              type: 'string',
              description: 'Email subject line',
            },
            body: {
              type: 'string',
              description: 'Email body content',
            },
            status: {
              type: 'string',
              description: 'Campaign status',
            },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'activate_campaign',
        description: 'Activate a campaign',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Campaign ID to activate',
            },
          },
          required: ['campaignId'],
        },
      },
      {
        name: 'create_account',
        description: 'Create a new sending account',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address for the account',
            },
            password: {
              type: 'string',
              description: 'Password for the email account',
            },
            smtp_host: {
              type: 'string',
              description: 'SMTP host',
            },
            smtp_port: {
              type: 'number',
              description: 'SMTP port',
            },
            smtp_username: {
              type: 'string',
              description: 'SMTP username',
            },
            smtp_password: {
              type: 'string',
              description: 'SMTP password',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'update_account',
        description: 'Update a sending account',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address of the account to update',
            },
            smtp_host: {
              type: 'string',
              description: 'SMTP host',
            },
            smtp_port: {
              type: 'number',
              description: 'SMTP port',
            },
            smtp_username: {
              type: 'string',
              description: 'SMTP username',
            },
            smtp_password: {
              type: 'string',
              description: 'SMTP password',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'get_warmup_analytics',
        description: 'Get warmup analytics for an account',
        inputSchema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              description: 'Email address of the account',
            },
          },
          required: ['email'],
        },
      },
      {
        name: 'get_campaign_analytics_overview',
        description: 'Get analytics overview for all campaigns',
        inputSchema: {
          type: 'object',
          properties: {
            dateFrom: {
              type: 'string',
              description: 'Start date for analytics (YYYY-MM-DD)',
            },
            dateTo: {
              type: 'string',
              description: 'End date for analytics (YYYY-MM-DD)',
            },
          },
        },
      },
      {
        name: 'list_emails',
        description: 'List emails with filters and pagination',
        inputSchema: {
          type: 'object',
          properties: {
            campaignId: {
              type: 'string',
              description: 'Filter by campaign ID',
            },
            status: {
              type: 'string',
              description: 'Filter by email status',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of emails to return',
            },
            offset: {
              type: 'number',
              description: 'Number of emails to skip for pagination',
            },
          },
        },
      },
      {
        name: 'move_leads',
        description: 'Move leads between campaigns or lists',
        inputSchema: {
          type: 'object',
          properties: {
            leadIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of lead IDs to move',
            },
            targetCampaignId: {
              type: 'string',
              description: 'Target campaign ID',
            },
            targetListId: {
              type: 'string',
              description: 'Target list ID',
            },
          },
          required: ['leadIds'],
        },
      },
      {
        name: 'update_lead',
        description: 'Update a lead',
        inputSchema: {
          type: 'object',
          properties: {
            leadId: {
              type: 'string',
              description: 'Lead ID to update',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            email: {
              type: 'string',
              description: 'Email address',
            },
            companyName: {
              type: 'string',
              description: 'Company name',
            },
            customFields: {
              type: 'object',
              description: 'Custom fields for the lead',
            },
          },
          required: ['leadId'],
        },
      },
      {
        name: 'list_api_keys',
        description: 'List all API keys',
        inputSchema: {
          type: 'object',
          properties: {
            limit: {
              type: 'number',
              description: 'Maximum number of API keys to return',
            },
            offset: {
              type: 'number',
              description: 'Number of API keys to skip for pagination',
            },
          },
        },
      },
      {
        name: 'create_api_key',
        description: 'Create a new API key',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'API key name',
            },
            permissions: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of permissions for the API key',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
  const { name, arguments: args } = request.params;

  try {
    const sdk = getSDK(); // Get SDK instance when needed

    switch (name) {
      case 'list_campaigns': {
        const result = await sdk.listCampaigns(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_campaign': {
        const result = await sdk.createCampaign(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_accounts': {
        const result = await sdk.listAccounts(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_campaign': {
        if (!args?.campaignId) {
          throw new McpError(ErrorCode.InvalidParams, 'campaignId is required');
        }
        const result = await sdk.getCampaign(args.campaignId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_campaign_analytics': {
        if (!args?.campaignId) {
          throw new McpError(ErrorCode.InvalidParams, 'campaignId is required');
        }
        const result = await sdk.getCampaignAnalytics(args.campaignId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'send_email': {
        const result = await sdk.sendEmail(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'verify_email': {
        const result = await sdk.verifyEmail(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_leads': {
        const result = await sdk.listLeads(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_lead': {
        const result = await sdk.createLead(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_lead_lists': {
        const result = await sdk.listLeadLists(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_lead_list': {
        const result = await sdk.createLeadList(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'update_campaign': {
        if (!args?.campaignId) {
          throw new McpError(ErrorCode.InvalidParams, 'campaignId is required');
        }
        const { campaignId, ...updateData } = args;
        const result = await sdk.updateCampaign(campaignId as string, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'activate_campaign': {
        if (!args?.campaignId) {
          throw new McpError(ErrorCode.InvalidParams, 'campaignId is required');
        }
        const result = await sdk.activateCampaign(args.campaignId as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_account': {
        const result = await sdk.createAccount(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'update_account': {
        if (!args?.email) {
          throw new McpError(ErrorCode.InvalidParams, 'email is required');
        }
        const { email, ...updateData } = args;
        const result = await sdk.updateAccount(email as string, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_warmup_analytics': {
        if (!args?.email) {
          throw new McpError(ErrorCode.InvalidParams, 'email is required');
        }
        const result = await sdk.getWarmupAnalytics(args.email as string);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'get_campaign_analytics_overview': {
        const result = await sdk.getCampaignAnalyticsOverview(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_emails': {
        const result = await sdk.listEmails(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'move_leads': {
        const result = await sdk.moveLeads(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'update_lead': {
        if (!args?.leadId) {
          throw new McpError(ErrorCode.InvalidParams, 'leadId is required');
        }
        const { leadId, ...updateData } = args;
        const result = await sdk.updateLead(leadId as string, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'list_api_keys': {
        const result = await sdk.listApiKeys(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      case 'create_api_key': {
        const result = await sdk.createApiKey(args || {});
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    console.error('Tool execution error:', error);
    if (error instanceof McpError) {
      throw error;
    }
    throw new McpError(
      ErrorCode.InternalError,
      `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Instantly MCP Server running on stdio');
}

// Auto-start if this is the main module
main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});

export { server }; 