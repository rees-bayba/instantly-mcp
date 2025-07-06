import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function listAccountsHandler(req, res) {
    try {
        const { filters = {}, pagination = {}, correlationId } = req.body || {};
        const params = { ...filters, ...pagination };
        const data = await sdk.listAccounts(params);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'list_accounts',
            params,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to list accounts', details: err.message });
    }
}
//# sourceMappingURL=listAccounts.js.map