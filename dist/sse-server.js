"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_proxy_1 = require("mcp-proxy");
const child_process_1 = require("child_process");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const path_1 = __importDefault(require("path"));
const url_1 = require("url");
const __filename = (0, url_1.fileURLToPath)(import.meta.url);
const __dirname = path_1.default.dirname(__filename);
const PORT = process.env.PORT || 3000;
async function main() {
    console.log(`Starting Instantly MCP Server with SSE on port ${PORT}`);
    // Start the HTTP server that will proxy to our stdio MCP server
    const { close } = await (0, mcp_proxy_1.startHTTPServer)({
        createServer: async () => {
            // Spawn our MCP server as a child process
            const serverPath = path_1.default.join(__dirname, 'mcp-server.js');
            const serverProcess = (0, child_process_1.spawn)('node', [serverPath], {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: process.env,
            });
            // Create a client transport to communicate with the spawned server
            const transport = new stdio_js_1.StdioClientTransport({
                stdin: serverProcess.stdin,
                stdout: serverProcess.stdout,
            });
            // Create and connect the client
            const client = new index_js_1.Client({
                name: 'instantly-mcp-proxy',
                version: '1.0.0',
            }, {
                capabilities: {},
            });
            await client.connect(transport);
            // Handle process cleanup
            process.on('SIGINT', () => {
                serverProcess.kill();
                close();
                process.exit(0);
            });
            process.on('SIGTERM', () => {
                serverProcess.kill();
                close();
                process.exit(0);
            });
            return client; // mcp-proxy expects a Server but we're providing a Client
        },
        port: PORT,
    });
    console.log(`Instantly MCP Server running on http://localhost:${PORT}`);
    console.log(`SSE endpoint: http://localhost:${PORT}/sse`);
    console.log(`Streamable HTTP endpoint: http://localhost:${PORT}/mcp`);
}
main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
