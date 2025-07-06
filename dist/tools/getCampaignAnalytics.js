import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function getCampaignAnalyticsHandler(req, res) {
    try {
        const { id, correlationId } = req.body;
        if (!id)
            return res.status(400).json({ error: 'Missing campaign id' });
        const data = await sdk.getCampaignAnalytics(id);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'get_campaign_analytics',
            params: { id },
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get campaign analytics', details: err.message });
    }
}
//# sourceMappingURL=getCampaignAnalytics.js.map