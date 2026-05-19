import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  const hasRegistered = localStorage.getItem('user_registered') === 'true';
  
  if (!isAuthenticated) {
    if (hasRegistered) {
      return <Navigate to="/login" replace />;
    } else {
      return <Navigate to="/register" replace />;
    }
  }
  return children;
};

// Route wrapper for auth pages (redirects to home if already logged in)
const AuthRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('user_authenticated') === 'true';
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
