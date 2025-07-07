import axios from 'axios';

const INSTANTLY_API_KEY = process.env.INSTANTLY_API_KEY;
const INSTANTLY_API_URL = process.env.INSTANTLY_API_URL || 'https://api.instantly.ai/api/v2';
const MAX_ATTEMPTS = parseInt(process.env.INSTANTLY_RETRY_MAX_ATTEMPTS || '3', 10);
const INITIAL_DELAY = parseInt(process.env.INSTANTLY_RETRY_INITIAL_DELAY || '1000', 10);
const MAX_DELAY = parseInt(process.env.INSTANTLY_RETRY_MAX_DELAY || '10000', 10);
const BACKOFF_FACTOR = parseFloat(process.env.INSTANTLY_RETRY_BACKOFF_FACTOR || '2');

export class InstantlySDK {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey = INSTANTLY_API_KEY, apiUrl = INSTANTLY_API_URL) {
    if (!apiKey) throw new Error('INSTANTLY_API_KEY is required');
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  private async retryRequest(config: any, attempt = 1, delay = INITIAL_DELAY): Promise<any> {
    try {
      return await axios(config);
    } catch (err: any) {
      if (attempt >= MAX_ATTEMPTS) throw err;
      const status = err.response?.status;
      if ([429, 500, 502, 503, 504].includes(status)) {
        const nextDelay = Math.min(delay * BACKOFF_FACTOR, MAX_DELAY);
        await new Promise(res => setTimeout(res, delay));
        return this.retryRequest(config, attempt + 1, nextDelay);
      }
      throw err;
    }
  }

  private async paginate(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    let page = params.page || 1;
    const limit = params.limit || 50;
    let allItems: any[] = [];
    let totalPages = 1;
    let totalItems = 0;
    do {
      const config: any = {
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

  async listCampaigns(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/campaigns', params);
  }

  async createCampaign(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async listAccounts(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/accounts', params);
  }

  async getCampaign(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async getCampaignAnalytics(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/analytics`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      params: { id },
    };
    return (await this.retryRequest(config)).data;
  }

  async sendEmail(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async verifyEmail(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/verify`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async listLeads(params: Record<string, any> = {}): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/list`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data: params,
    };
    return (await this.retryRequest(config)).data;
  }

  async createLead(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async listLeadLists(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/lead-lists', params);
  }

  async createLeadList(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/lead-lists`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async updateCampaign(id: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async activateCampaign(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/${id}/activate`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async createAccount(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async updateAccount(email: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async getWarmupAnalytics(email: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}/warmup-analytics`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async getCampaignAnalyticsOverview(params: Record<string, any> = {}): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/analytics/overview`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      params,
    };
    return (await this.retryRequest(config)).data;
  }

  async listEmails(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/emails', params);
  }

  async moveLeads(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/move`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async updateLead(id: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async listApiKeys(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/api-keys', params);
  }

  async createApiKey(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/api-keys`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }
} 