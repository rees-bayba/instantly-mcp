let clients = [];
let clientId = 0;
export function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    const id = ++clientId;
    clients.push({ id, res });
    // Heartbeat
    const heartbeat = setInterval(() => {
        res.write(': keepalive\n\n');
    }, 30000);
    req.on('close', () => {
        clearInterval(heartbeat);
        clients = clients.filter(c => c.id !== id);
    });
}
export function broadcastEvent(event, data) {
    const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => client.res.write(payload));
}
//# sourceMappingURL=sse.js.map