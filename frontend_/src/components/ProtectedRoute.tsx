import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[]; // now supports multiple roles
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const token = localStorage.getItem('access_token');

  // Not logged in → redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // Role restricted → redirect to home if user's role not in allowed list
  if (allowedRoles && !allowedRoles.includes(user?.profile.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
