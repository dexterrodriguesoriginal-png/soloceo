import React from 'react';

// With the demo mode active, authentication checks are removed.
// This component now simply renders its children.
const ProtectedRoute = ({ children }) => {
  return children;
};

export default ProtectedRoute;
