import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function getCampaignHandler(req, res) {
    try {
        const { id, correlationId } = req.body;
        if (!id)
            return res.status(400).json({ error: 'Missing campaign id' });
        const data = await sdk.getCampaign(id);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'get_campaign',
            params: { id },
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to get campaign', details: err.message });
    }
}
//# sourceMappingURL=getCampaign.js.map