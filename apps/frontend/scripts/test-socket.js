const { io } = require('socket.io-client');
const fs = require('fs');
const path = require('path');

// Load .env simple parser
const envPath = path.resolve(__dirname, '..', '.env');
let apiUrl = 'http://localhost:5000';
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  // Prefer NEXT_PUBLIC_SOCKET_URL for websocket base
  const socketMatch = content.match(/NEXT_PUBLIC_SOCKET_URL\s*=\s*(.+)/);
  const baseMatch = content.match(/NEXT_PUBLIC_BASE_API\s*=\s*(.+)/);
  if (socketMatch) apiUrl = socketMatch[1].trim();
  else if (baseMatch) apiUrl = baseMatch[1].trim();
}

// Convert to websocket URL and remove /ts
let wsUrl = apiUrl;
try {
  const u = new URL(apiUrl);
  wsUrl = u.origin.replace('https://', 'wss://').replace('http://', 'ws://');
} catch (err) {
  wsUrl = apiUrl.replace('https://', 'wss://').replace('http://', 'ws://').replace('/ts', '');
}

const token = process.env.TEST_SOCKET_TOKEN || '';

console.log('Connecting to', wsUrl);
if (!token) console.warn('No TEST_SOCKET_TOKEN provided — connection may be rejected by auth');

const socket = io(wsUrl, {
  auth: { token },
  transports: ['websocket', 'polling'],
  forceNew: true,
});

socket.on('connect', () => {
  console.log('connected, id=', socket.id);

  // request conversations
  console.log('emitting private:conversations');
  socket.emit('private:conversations');

  // request chat history for a sample conversation id
  console.log('emitting private:chat_history for conversationId "sample-conv"');
  socket.emit('private:chat_history', { conversationId: 'sample-conv' });

  // send a private message test (if token present)
  if (token) {
    console.log('emitting private:send_message test');
    socket.emit('private:send_message', {
      senderId: 'test-sender',
      receiverId: 'test-recipient',
      message: 'Hello from test script',
    }, (ack) => {
      console.log('ack for private:send_message:', ack);
    });
  }
});

socket.on('private:conversations', (data) => {
  console.log('received private:conversations:', data);
});

socket.on('private:chat_history', (data) => {
  console.log('received private:chat_history:', data);
});

socket.on('private:new_message', (data) => {
  console.log('received private:new_message:', data);
});

socket.on('connect_error', (err) => {
  console.error('connect_error', err && err.message ? err.message : err);
});

socket.on('disconnect', (reason) => {
  console.log('disconnected:', reason);
});

// keep process alive
setTimeout(() => {
  console.log('closing after 30s');
  socket.disconnect();
  process.exit(0);
}, 30000);
