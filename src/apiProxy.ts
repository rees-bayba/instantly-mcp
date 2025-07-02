import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = 'https://api.instantly.ai/api/v2';

const apiProxy = Router();

apiProxy.use(
  '/',
  createProxyMiddleware({
    target: INSTANTLY_API_URL,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '',
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log('Proxying request:', req.method, req.originalUrl);
      if (INSTANTLY_API_KEY) {
        proxyReq.setHeader('Authorization', `Bearer ${INSTANTLY_API_KEY}`);
        console.log('Using Instantly API Key:', INSTANTLY_API_KEY.slice(0, 6) + '...');
      } else {
        console.log('No Instantly API Key set!');
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (res.writeHead) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
      }
      res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
    },
    logLevel: 'debug',
  })
);

export default apiProxy; 