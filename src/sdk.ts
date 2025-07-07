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

  // Email Management Tools
  async replyToEmail(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/reply`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async getEmail(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async updateEmail(id: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteEmail(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async countUnreadEmails(): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/unread/count`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async markThreadAsRead(threadId: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/emails/threads/${threadId}/mark-as-read`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  // Advanced Analytics Tools
  async getDailyCampaignAnalytics(params: Record<string, any> = {}): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/analytics/daily`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      params,
    };
    return (await this.retryRequest(config)).data;
  }

  async getCampaignStepsAnalytics(params: Record<string, any> = {}): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/analytics/steps`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      params,
    };
    return (await this.retryRequest(config)).data;
  }

  // Subsequence Management Tools
  async createSubsequence(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async listSubsequences(params: Record<string, any> = {}): Promise<any> {
    return this.paginate('/subsequences', params);
  }

  async getSubsequence(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async updateSubsequence(id: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteSubsequence(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async duplicateSubsequence(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}/duplicate`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async pauseSubsequence(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}/pause`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async resumeSubsequence(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/subsequences/${id}/resume`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  // Comprehensive Data Retrieval Tools
  async getLead(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteLead(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async getLeadList(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/lead-lists/${id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async updateLeadList(id: string, data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/lead-lists/${id}`,
      method: 'PATCH',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteLeadList(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/lead-lists/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async pauseCampaign(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/${id}/pause`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteCampaign(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/campaigns/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async getAccount(email: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async deleteAccount(email: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async pauseAccount(email: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}/pause`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  async resumeAccount(email: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/accounts/${email}/resume`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }

  // Additional Lead Management
  async mergeLeads(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/merge`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async updateLeadInterestStatus(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/update-interest-status`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  async removeLeadFromSubsequence(data: Record<string, any>): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/leads/subsequence/remove`,
      method: 'POST',
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data,
    };
    return (await this.retryRequest(config)).data;
  }

  // API Key Management
  async deleteApiKey(id: string): Promise<any> {
    const config: any = {
      url: `${this.apiUrl}/api-keys/${id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${this.apiKey}` },
    };
    return (await this.retryRequest(config)).data;
  }
} 