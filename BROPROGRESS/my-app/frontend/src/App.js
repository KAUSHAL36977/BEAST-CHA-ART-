import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import socketService from './services/socket';
import { ErrorBoundary } from './utils/errorHandling';

// Import components
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Workspace from './components/Workspace';
import Page from './components/Page';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

function App() {
  React.useEffect(() => {
    // Connect to socket server when app starts
    socketService.connect();

    return () => {
      // Disconnect when app unmounts
      socketService.disconnect();
    };
  }, []);

  return (
    <ErrorBoundary>
      <ChakraProvider resetCSS>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/workspace/:workspaceId"
                element={
                  <PrivateRoute>
                    <Workspace />
                  </PrivateRoute>
                }
              />
              <Route
                path="/page/:pageId"
                element={
                  <PrivateRoute>
                    <Page />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </ChakraProvider>
    </ErrorBoundary>
  );
}

export default App;
