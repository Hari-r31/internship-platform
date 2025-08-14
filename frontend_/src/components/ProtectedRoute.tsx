import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[]; // now supports multiple roles
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuth();
  const token = localStorage.getItem("access_token");

  // If not logged in, redirect to login
  if (!token) return <Navigate to="/login" replace />;

  // If role restricted, check role safely
  const userRole = user?.profile?.role; // safe access
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // wrap children in fragment for JSX safety
}