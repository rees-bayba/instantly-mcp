import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, ErrorCode, McpError, } from '@modelcontextprotocol/sdk/types.js';
import { InstantlySDK } from './sdk.js';
// Initialize the MCP server
const server = new Server({
    name: 'instantly-mcp-server',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// Function to get SDK instance (lazy initialization)
function getSDK() {
    const apiKey = process.env.INSTANTLY_API_KEY;
    if (!apiKey) {
        throw new McpError(ErrorCode.InvalidParams, 'INSTANTLY_API_KEY environment variable is required');
    }
    return new InstantlySDK(apiKey, process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v1');
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
        ],
    };
});
// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
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
                const result = await sdk.getCampaign(args.campaignId);
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
                const result = await sdk.getCampaignAnalytics(args.campaignId);
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
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        console.error('Tool execution error:', error);
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
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
//# sourceMappingURL=mcp-server.js.map