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
    onProxyReq: (proxyReq) => {
      if (INSTANTLY_API_KEY) {
        proxyReq.setHeader('Authorization', `Bearer ${INSTANTLY_API_KEY}`);
      }
    },
    logLevel: 'warn',
  })
);

export default apiProxy; 