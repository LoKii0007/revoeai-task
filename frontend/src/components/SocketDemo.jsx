import React, { useEffect, useState } from 'react';
import { initializeSocket, subscribeToEvent, emitEvent, disconnectSocket } from '../socket/socketService';

const SocketDemo = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    // Initialize socket connection when component mounts
    const socket = initializeSocket();

    // Set up event listeners
    const unsubscribeConnect = subscribeToEvent('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
    });

    const unsubscribeDisconnect = subscribeToEvent('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    // Example of subscribing to a custom event from the server
    const unsubscribeMessage = subscribeToEvent('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, { text: data.text, fromServer: true }]);
    });

    // Clean up event listeners when component unmounts
    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeMessage();
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      // Send message to server
      emitEvent('message', { text: inputMessage });
      
      // Add message to local state
      setMessages((prevMessages) => [...prevMessages, { text: inputMessage, fromServer: false }]);
      setInputMessage('');
    }
  };

  return (
    <div className="socket-demo">
      <div className="connection-status">
        Status: {isConnected ? 
          <span className="connected">Connected</span> : 
          <span className="disconnected">Disconnected</span>}
      </div>

      <div className="message-container">
        {messages.length === 0 ? (
          <p className="no-messages">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.fromServer ? 'server-message' : 'client-message'}`}
            >
              <span className="message-source">{msg.fromServer ? 'Server' : 'You'}: </span>
              {msg.text}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="message-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !inputMessage.trim()}>
          Send
        </button>
      </form>

      <style jsx>{`
        .socket-demo {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .connection-status {
          margin-bottom: 15px;
          padding: 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        
        .connected {
          color: green;
          font-weight: bold;
        }
        
        .disconnected {
          color: red;
          font-weight: bold;
        }
        
        .message-container {
          height: 300px;
          overflow-y: auto;
          border: 1px solid #eee;
          padding: 10px;
          margin-bottom: 15px;
          border-radius: 4px;
        }
        
        .message {
          margin-bottom: 10px;
          padding: 8px 12px;
          border-radius: 18px;
          max-width: 80%;
          word-break: break-word;
        }
        
        .server-message {
          background-color: #f1f0f0;
          align-self: flex-start;
          margin-right: auto;
          border-bottom-left-radius: 4px;
        }
        
        .client-message {
          background-color: #0084ff;
          color: white;
          align-self: flex-end;
          margin-left: auto;
          border-bottom-right-radius: 4px;
        }
        
        .message-source {
          font-weight: bold;
        }
        
        .no-messages {
          color: #888;
          text-align: center;
          margin-top: 120px;
        }
        
        .message-form {
          display: flex;
          gap: 10px;
        }
        
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        
        button {
          padding: 10px 15px;
          background-color: #0084ff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SocketDemo; 