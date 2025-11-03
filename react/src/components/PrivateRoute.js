import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div data-easytag="id1-react/src/components/PrivateRoute.js" className="min-h-[40vh] flex items-center justify-center">
        <div data-easytag="id2-react/src/components/PrivateRoute.js" className="text-muted">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
