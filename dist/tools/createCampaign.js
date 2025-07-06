import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function createCampaignHandler(req, res) {
    try {
        const { correlationId, ...campaignData } = req.body;
        const data = await sdk.createCampaign(campaignData);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'create_campaign',
            params: campaignData,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create campaign', details: err.message });
    }
}
//# sourceMappingURL=createCampaign.js.map