// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * PrivateRoute wrapper
 * - allowedRoles: array of roles that can access the child component
 * - If no token found => redirect to /login
 * - If token found but role not allowed => redirect to /home (or /unauthorized)
 */
export default function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // set at login

  if (!token) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // logged in but role not allowed
    return <Navigate to="/home" replace />;
  }

  // allowed
  return children;
}
