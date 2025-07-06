import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function listLeadsHandler(req, res) {
    try {
        const { filters = {}, pagination = {}, correlationId } = req.body || {};
        const params = { ...filters, ...pagination };
        const data = await sdk.listLeads(params);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'list_leads',
            params,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list leads', details: err.message });
    }
}
//# sourceMappingURL=listLeads.js.map