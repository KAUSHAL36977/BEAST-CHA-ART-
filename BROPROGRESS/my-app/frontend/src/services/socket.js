import { io } from 'socket.io-client';
import { setupSocketErrorHandler, handleSocketError, retryOperation } from '../utils/errorHandling';

const SOCKET_URL = 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('token'),
        },
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
      });

      // Setup error handlers
      setupSocketErrorHandler(this.socket);

      this.socket.on('connect', () => {
        console.log('Connected to socket server');
        this.reconnectAttempts = 0;
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      this.socket.on('connect_error', (error) => {
        this.reconnectAttempts++;
        handleSocketError(error, 'connect_error');
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  async joinPage(pageId) {
    return retryOperation(async () => {
      if (this.socket) {
        return new Promise((resolve, reject) => {
          this.socket.emit('joinPage', { pageId }, (response) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          });
        });
      }
    });
  }

  async leavePage(pageId) {
    return retryOperation(async () => {
      if (this.socket) {
        return new Promise((resolve, reject) => {
          this.socket.emit('leavePage', { pageId }, (response) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          });
        });
      }
    });
  }

  onBlockUpdate(callback) {
    if (this.socket) {
      this.socket.on('blockUpdate', (data) => {
        try {
          callback(data);
        } catch (error) {
          handleSocketError(error, 'blockUpdate');
        }
      });
    }
  }

  onUserJoined(callback) {
    if (this.socket) {
      this.socket.on('userJoined', (data) => {
        try {
          callback(data);
        } catch (error) {
          handleSocketError(error, 'userJoined');
        }
      });
    }
  }

  onUserLeft(callback) {
    if (this.socket) {
      this.socket.on('userLeft', (data) => {
        try {
          callback(data);
        } catch (error) {
          handleSocketError(error, 'userLeft');
        }
      });
    }
  }

  async updateBlock(blockId, content) {
    return retryOperation(async () => {
      if (this.socket) {
        return new Promise((resolve, reject) => {
          this.socket.emit('updateBlock', { blockId, content }, (response) => {
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response);
            }
          });
        });
      }
    });
  }
}

export const socketService = new SocketService();
export default socketService; 