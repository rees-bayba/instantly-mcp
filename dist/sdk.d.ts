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
}
//# sourceMappingURL=sdk.d.ts.map