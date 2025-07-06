export declare class InstantlySDK {
    private apiKey;
    private apiUrl;
    constructor(apiKey?: string | undefined, apiUrl?: string);
    private retryRequest;
    private paginate;
    listCampaigns(params?: Record<string, any>): Promise<any>;
    createCampaign(data: Record<string, any>): Promise<any>;
    listAccounts(params?: Record<string, any>): Promise<any>;
    getCampaign(id: string): Promise<any>;
    getCampaignAnalytics(id: string): Promise<any>;
    sendEmail(data: Record<string, any>): Promise<any>;
    verifyEmail(data: Record<string, any>): Promise<any>;
    listLeads(params?: Record<string, any>): Promise<any>;
    createLead(data: Record<string, any>): Promise<any>;
    listLeadLists(params?: Record<string, any>): Promise<any>;
    createLeadList(data: Record<string, any>): Promise<any>;
    updateCampaign(id: string, data: Record<string, any>): Promise<any>;
    activateCampaign(id: string): Promise<any>;
    createAccount(data: Record<string, any>): Promise<any>;
    updateAccount(email: string, data: Record<string, any>): Promise<any>;
    getWarmupAnalytics(email: string): Promise<any>;
    getCampaignAnalyticsOverview(params?: Record<string, any>): Promise<any>;
    listEmails(params?: Record<string, any>): Promise<any>;
    moveLeads(data: Record<string, any>): Promise<any>;
    updateLead(id: string, data: Record<string, any>): Promise<any>;
    listApiKeys(params?: Record<string, any>): Promise<any>;
    createApiKey(data: Record<string, any>): Promise<any>;
}
//# sourceMappingURL=sdk.d.ts.map