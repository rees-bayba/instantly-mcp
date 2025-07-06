import { Router } from 'express';
import axios from 'axios';
const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2';
const MAX_ATTEMPTS = parseInt(process.env.INSTANTLY_RETRY_MAX_ATTEMPTS || '3', 10);
const INITIAL_DELAY = parseInt(process.env.INSTANTLY_RETRY_INITIAL_DELAY || '1000', 10);
const MAX_DELAY = parseInt(process.env.INSTANTLY_RETRY_MAX_DELAY || '10000', 10);
const BACKOFF_FACTOR = parseFloat(process.env.INSTANTLY_RETRY_BACKOFF_FACTOR || '2');
const apiProxy = Router();
async function retryRequest(config, attempt = 1, delay = INITIAL_DELAY) {
    try {
        return await axios(config);
    }
    catch (err) {
        if (attempt >= MAX_ATTEMPTS)
            throw err;
        const status = err.response?.status;
        if (status === 429 || status === 500 || status === 502 || status === 503 || status === 504) {
            const nextDelay = Math.min(delay * BACKOFF_FACTOR, MAX_DELAY);
            console.warn(`Retrying Instantly API request (attempt ${attempt + 1}/${MAX_ATTEMPTS}) after ${delay}ms...`);
            await new Promise(res => setTimeout(res, delay));
            return retryRequest(config, attempt + 1, nextDelay);
        }
        throw err;
    }
}
apiProxy.use('/', async (req, res, next) => {
    const url = INSTANTLY_API_URL + req.originalUrl.replace(/^\/api/, '');
    const method = req.method.toLowerCase();
    const headers = {
        ...req.headers,
        authorization: `Bearer ${INSTANTLY_API_KEY}`,
    };
    try {
        const config = {
            url,
            method,
            headers,
            data: req.body,
            params: req.query,
            validateStatus: () => true,
        };
        const response = await retryRequest(config);
        res.status(response.status).set(response.headers).send(response.data);
    }
    catch (err) {
        console.error('Proxy error:', err.message);
        res.status(err.response?.status || 500).json({ error: 'Proxy error', details: err.message });
    }
});
export default apiProxy;
//# sourceMappingURL=apiProxy.js.map