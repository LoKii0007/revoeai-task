import { io } from 'socket.io-client';

// Get the backend URL from environment variables or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Socket instance that will be reused across the application
let socket;

/**
 * Initialize the Socket.IO connection
 * @returns {Object} The socket instance
 */
export const initializeSocket = () => {
  if (!socket) {
    socket = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server with ID:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected from Socket.IO server:', reason);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected to Socket.IO server after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('Failed to reconnect to Socket.IO server');
    });
  }

  return socket;
};

/**
 * Get the socket instance
 * @returns {Object} The socket instance
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected manually');
  }
};

/**
 * Subscribe to a socket event
 * @param {string} eventName - The name of the event to subscribe to
 * @param {Function} callback - The callback function to execute when the event is received
 */
export const subscribeToEvent = (eventName, callback) => {
  const socket = getSocket();
  socket.on(eventName, callback);
  return () => socket.off(eventName, callback); // Return unsubscribe function
};

/**
 * Emit a socket event
 * @param {string} eventName - The name of the event to emit
 * @param {any} data - The data to send with the event
 */
export const emitEvent = (eventName, data) => {
  const socket = getSocket();
  socket.emit(eventName, data);
}; 