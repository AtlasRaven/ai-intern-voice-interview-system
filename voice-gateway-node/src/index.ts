import http from 'http';
import { WebSocketServer } from 'ws';
import { config } from './config/env.js';
import { WebSocketGateway } from './gateway/WebSocketGateway.js';

const server = http.createServer((req, res) => {
  // Simple health check endpoint
  if (req.url === '/health' || req.url === '/api/v1/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      service: 'voice-gateway-node',
      sttProvider: config.sttProvider,
      ttsProvider: config.ttsProvider,
      llmProvider: config.llmProvider,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Voice Gateway WebSocket is running at ws://localhost:' + config.port + '/ws/interview');
});

const wss = new WebSocketServer({ server, path: '/ws/interview' });
new WebSocketGateway(wss);

server.listen(config.port, () => {
  console.log(`================================================================`);
  console.log(`🎙️  Voice/AI Gateway is listening on port ${config.port}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${config.port}/ws/interview`);
  console.log(`⚙️  Active Providers: STT=${config.sttProvider}, TTS=${config.ttsProvider}, LLM=${config.llmProvider}`);
  console.log(`🔗 Connected to Spring Backend: ${config.springBackendUrl}`);
  console.log(`================================================================`);
});
