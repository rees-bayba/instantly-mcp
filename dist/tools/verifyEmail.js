import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function verifyEmailHandler(req, res) {
    try {
        const { email, correlationId } = req.body;
        if (!email)
            return res.status(400).json({ error: 'Missing email' });
        const data = await sdk.verifyEmail({ email });
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'verify_email',
            params: { email },
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to verify email', details: err.message });
    }
}
//# sourceMappingURL=verifyEmail.js.map