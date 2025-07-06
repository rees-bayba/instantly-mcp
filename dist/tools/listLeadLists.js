import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function listLeadListsHandler(req, res) {
    try {
        const { filters = {}, pagination = {}, correlationId } = req.body || {};
        const params = { ...filters, ...pagination };
        const data = await sdk.listLeadLists(params);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'list_lead_lists',
            params,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list lead lists', details: err.message });
    }
}
//# sourceMappingURL=listLeadLists.js.map