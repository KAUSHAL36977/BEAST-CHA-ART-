import React from 'react';

// Error Types
export const ErrorTypes = {
  API_ERROR: 'API_ERROR',
  SOCKET_ERROR: 'SOCKET_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Custom Error Classes
export class APIError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.type = ErrorTypes.API_ERROR;
  }
}

export class SocketError extends Error {
  constructor(message, event) {
    super(message);
    this.name = 'SocketError';
    this.event = event;
    this.type = ErrorTypes.SOCKET_ERROR;
  }
}

export class AuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthError';
    this.type = ErrorTypes.AUTH_ERROR;
  }
}

// Error Handler Functions
export const handleAPIError = (error) => {
  if (error.response) {
    // Server responded with error
    throw new APIError(
      error.response.data.message || 'API request failed',
      error.response.status,
      error.response.data
    );
  } else if (error.request) {
    // Request made but no response
    throw new APIError('No response from server', 0, null);
  } else {
    // Other errors
    throw new APIError(error.message, 0, null);
  }
};

export const handleSocketError = (error, event) => {
  throw new SocketError(
    error.message || 'Socket connection error',
    event
  );
};

export const handleAuthError = (error) => {
  throw new AuthError(
    error.message || 'Authentication failed'
  );
};

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    // Log error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error && this.state.error.toString()}</pre>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// API Error Interceptor
export const setupAPIErrorInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      handleAPIError(error);
      return Promise.reject(error);
    }
  );
};

// Socket Error Handler
export const setupSocketErrorHandler = (socket) => {
  socket.on('error', (error) => {
    handleSocketError(error, 'socket_error');
  });

  socket.on('connect_error', (error) => {
    handleSocketError(error, 'connect_error');
  });
};

// Error Logger
export const logError = (error, context = {}) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
      type: error.type || ErrorTypes.UNKNOWN_ERROR
    },
    context
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog);
  }

  // Here you can add your error reporting service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { extra: context });
  // }
};

// Error Message Formatter
export const formatErrorMessage = (error) => {
  switch (error.type) {
    case ErrorTypes.API_ERROR:
      return `API Error: ${error.message}`;
    case ErrorTypes.SOCKET_ERROR:
      return `Connection Error: ${error.message}`;
    case ErrorTypes.AUTH_ERROR:
      return `Authentication Error: ${error.message}`;
    case ErrorTypes.VALIDATION_ERROR:
      return `Validation Error: ${error.message}`;
    case ErrorTypes.NETWORK_ERROR:
      return 'Network Error: Please check your internet connection';
    default:
      return 'An unexpected error occurred';
  }
};

// Error Recovery Functions
export const retryOperation = async (operation, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw lastError;
};

// Export all error handling utilities
export default {
  ErrorTypes,
  APIError,
  SocketError,
  AuthError,
  handleAPIError,
  handleSocketError,
  handleAuthError,
  ErrorBoundary,
  setupAPIErrorInterceptor,
  setupSocketErrorHandler,
  logError,
  formatErrorMessage,
  retryOperation
}; 