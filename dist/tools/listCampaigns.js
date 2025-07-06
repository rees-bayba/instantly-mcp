import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function listCampaignsHandler(req, res) {
    try {
        const { filters = {}, pagination = {}, correlationId } = req.body || {};
        const params = { ...filters, ...pagination };
        const data = await sdk.listCampaigns(params);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'list_campaigns',
            params,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list campaigns', details: err.message });
    }
}
//# sourceMappingURL=listCampaigns.js.map