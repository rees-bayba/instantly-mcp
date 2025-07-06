import { InstantlySDK } from '../sdk';
import { broadcastEvent } from '../sse';
const sdk = new InstantlySDK();
export async function sendEmailHandler(req, res) {
    try {
        const { correlationId, ...emailData } = req.body;
        const data = await sdk.sendEmail(emailData);
        res.json(data);
        broadcastEvent('tool_result', {
            tool: 'send_email',
            params: emailData,
            result: data,
            timestamp: Date.now(),
            correlationId,
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to send email', details: err.message });
    }
}
//# sourceMappingURL=sendEmail.js.map