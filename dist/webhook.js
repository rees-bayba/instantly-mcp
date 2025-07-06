import { broadcastEvent } from './sse';
const webhookHandler = (req, res) => {
    const event = req.body;
    console.log('Received webhook:', event);
    broadcastEvent('webhook', event);
    res.status(200).json({ status: 'ok' });
};
export default webhookHandler;
//# sourceMappingURL=webhook.js.map