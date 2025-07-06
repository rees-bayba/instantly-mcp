import axios from 'axios';
const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2';
const MAX_ATTEMPTS = parseInt(process.env.INSTANTLY_RETRY_MAX_ATTEMPTS || '3', 10);
const INITIAL_DELAY = parseInt(process.env.INSTANTLY_RETRY_INITIAL_DELAY || '1000', 10);
const MAX_DELAY = parseInt(process.env.INSTANTLY_RETRY_MAX_DELAY || '10000', 10);
const BACKOFF_FACTOR = parseFloat(process.env.INSTANTLY_RETRY_BACKOFF_FACTOR || '2');
export class InstantlySDK {
    apiKey;
    apiUrl;
    constructor(apiKey = INSTANTLY_API_KEY, apiUrl = INSTANTLY_API_URL) {
        if (!apiKey)
            throw new Error('INSTANTLY_API_KEY is required');
        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
    }
    async retryRequest(config, attempt = 1, delay = INITIAL_DELAY) {
        try {
            return await axios(config);
        }
        catch (err) {
            if (attempt >= MAX_ATTEMPTS)
                throw err;
            const status = err.response?.status;
            if ([429, 500, 502, 503, 504].includes(status)) {
                const nextDelay = Math.min(delay * BACKOFF_FACTOR, MAX_DELAY);
                await new Promise(res => setTimeout(res, delay));
                return this.retryRequest(config, attempt + 1, nextDelay);
            }
            throw err;
        }
    }
    async paginate(endpoint, params = {}) {
        let page = params.page || 1;
        const limit = params.limit || 50;
        let allItems = [];
        let totalPages = 1;
        let totalItems = 0;
        do {
            const config = {
                url: `${this.apiUrl}${endpoint}`,
                method: 'GET',
                headers: { Authorization: `Bearer ${this.apiKey}` },
                params: { ...params, page, limit },
            };
            const response = await this.retryRequest(config);
            const { items = [], pagination = {} } = response.data;
            allItems = allItems.concat(items);
            totalPages = pagination.totalPages || 1;
            totalItems = pagination.totalItems || allItems.length;
            page++;
        } while (page <= totalPages);
        return { items: allItems, pagination: { totalPages, totalItems } };
    }
    async listCampaigns(params = {}) {
        return this.paginate('/campaigns', params);
    }
    async createCampaign(data) {
        const config = {
            url: `${this.apiUrl}/campaigns`,
            method: 'POST',
            headers: { Authorization: `Bearer ${this.apiKey}` },
            data,
        };
        return (await this.retryRequest(config)).data;
    }
    async listAccounts(params = {}) {
        return this.paginate('/accounts', params);
    }
    async getCampaign(id) {
        const config = {
            url: `${this.apiUrl}/campaigns/${id}`,
            method: 'GET',
            headers: { Authorization: `Bearer ${this.apiKey}` },
        };
        return (await this.retryRequest(config)).data;
    }
    async getCampaignAnalytics(id) {
        const config = {
            url: `${this.apiUrl}/campaigns/analytics`,
            method: 'GET',
            headers: { Authorization: `Bearer ${this.apiKey}` },
            params: { id },
        };
        return (await this.retryRequest(config)).data;
    }
    async sendEmail(data) {
        const config = {
            url: `${this.apiUrl}/emails`,
            method: 'POST',
            headers: { Authorization: `Bearer ${this.apiKey}` },
            data,
        };
        return (await this.retryRequest(config)).data;
    }
    async verifyEmail(data) {
        const config = {
            url: `${this.apiUrl}/emails/verify`,
            method: 'POST',
            headers: { Authorization: `Bearer ${this.apiKey}` },
            data,
        };
        return (await this.retryRequest(config)).data;
    }
    async listLeads(params = {}) {
        return this.paginate('/leads', params);
    }
    async createLead(data) {
        const config = {
            url: `${this.apiUrl}/leads`,
            method: 'POST',
            headers: { Authorization: `Bearer ${this.apiKey}` },
            data,
        };
        return (await this.retryRequest(config)).data;
    }
    async listLeadLists(params = {}) {
        return this.paginate('/lead-lists', params);
    }
}
//# sourceMappingURL=sdk.js.map