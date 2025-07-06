#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Path to our compiled MCP server
const serverPath = path.join(__dirname, 'dist', 'mcp-server.js');

console.log(`Starting Instantly MCP Server with SSE on port ${PORT}`);
console.log(`Server path: ${serverPath}`);

// Start mcp-proxy with our MCP server
const proxyArgs = [
  'mcp-proxy', 
  '--port', PORT.toString(),
  'node', 
  serverPath
];

console.log('Running command:', 'npx', proxyArgs.join(' '));

const proxyProcess = spawn('npx', proxyArgs, {
  stdio: 'inherit',
  env: process.env,
});

proxyProcess.on('error', (error) => {
  console.error('Failed to start mcp-proxy:', error);
  process.exit(1);
});

proxyProcess.on('exit', (code) => {
  console.log(`mcp-proxy exited with code ${code}`);
  process.exit(code || 0);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down...');
  proxyProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down...');
  proxyProcess.kill('SIGTERM');
});

console.log(`Instantly MCP Server will be available at:`);
console.log(`- SSE endpoint: http://localhost:${PORT}/sse`);
console.log(`- Streamable HTTP endpoint: http://localhost:${PORT}/mcp`);
console.log(`- Health check: http://localhost:${PORT}/health`); 