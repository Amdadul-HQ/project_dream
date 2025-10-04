'use client';

import React, { useEffect, useState } from 'react';
import { socketService } from '../../services/socket';
import { useChat } from '../../contexts/ChatContext';

export function SocketDebugger() {
  const { userId } = useChat();
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState<string>('Hello, test message!');
  const [tokenLength, setTokenLength] = useState<number | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  // Read cookies and attempt connection only on client to avoid SSR mismatches
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const getTokenFromCookies = (): string | null => {
      const cookies = document.cookie ? document.cookie.split(';') : [];
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('accessToken='));
      if (tokenCookie) return tokenCookie.split('=')[1];
      return null;
    };

    const token = getTokenFromCookies();
    setTokenLength(token ? token.length : 0);

    if (!token) {
      addLog('No token found in cookies');
      return;
    }

    addLog(`Attempting to connect with token (length: ${token.length})`);
    addLog(`User ID: ${userId}`);
    setConnectionStatus('connecting');

    socketService.connect(token)
      .then(() => {
        addLog('Successfully connected to socket server');
        setConnectionStatus('connected');

        // Listen for any incoming events
        const socket = socketService.getSocket();
        if (socket) {
          socket.onAny((eventName, ...args) => {
            addLog(`Received event: ${eventName} with data: ${JSON.stringify(args)}`);
          });
        }
      })
      .catch((error) => {
        addLog(`Connection failed: ${error?.message || String(error)}`);
        setConnectionStatus('failed');
      });

    return () => {
      socketService.disconnect();
      setConnectionStatus('disconnected');
    };
  }, [userId]);

  const handleTestMessage = () => {
    if (!userId) {
      addLog('No userId provided for test message');
      return;
    }

    if (!socketService.isConnected()) {
      addLog('Not connected - cannot send test message');
      return;
    }

    addLog(`Sending test message: "${testMessage}"`);
    socketService.sendMessage('test-recipient-id', { content: testMessage }, userId);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const statusColor = {
    disconnected: 'text-gray-500',
    connecting: 'text-yellow-500',
    connected: 'text-green-500',
    failed: 'text-red-500'
  }[connectionStatus];

  // tokenLength is null during SSR; use stable placeholder to avoid hydration mismatch
  const tokenLengthDisplay = tokenLength === null ? '—' : String(tokenLength);

  return (
    <div className="p-4 bg-gray-100 rounded-lg max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Socket Connection Debugger</h3>
      
      <div className="mb-4">
        <span className="font-medium">Status: </span>
        <span className={`font-semibold ${statusColor}`}>
          {connectionStatus}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Test message content"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={handleTestMessage}
            disabled={connectionStatus !== 'connected' || !userId}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Send Test
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Token length: {tokenLengthDisplay} | User ID: {userId || 'Not provided'}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Debug Logs:</h4>
          <button
            onClick={handleClearLogs}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded"
          >
            Clear
          </button>
        </div>
        <div className="bg-black text-green-400 p-3 rounded text-sm font-mono h-64 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-xs text-gray-600">
        <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_BASE_API}</p>
        <p><strong>Expected Events:</strong> private:send_message, private:new_message, etc.</p>
        <p><strong>Connection Status:</strong> Check browser network tab for WebSocket connection</p>
      </div>
    </div>
  );
}