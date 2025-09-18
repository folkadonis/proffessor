import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, isAdmin, isApprovedUser } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/" />;
  }

  if (!adminOnly && !isApprovedUser()) {
    return (
      <div className="pending-approval">
        <h2>Account Pending Approval</h2>
        <p>Your account is awaiting admin approval. Please check back later.</p>
        <button onClick={() => window.location.reload()}>Refresh</button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;