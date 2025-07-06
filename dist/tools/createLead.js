import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function createLeadHandler(req, res) {
    try {
        const { correlationId, ...leadData } = req.body;
        const data = await sdk.createLead(leadData);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'create_lead',
            params: leadData,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to create lead', details: err.message });
    }
}
//# sourceMappingURL=createLead.js.map