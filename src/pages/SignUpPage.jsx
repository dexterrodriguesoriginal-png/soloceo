import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// This page has been deprecated as authentication is no longer required.
const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return null;
};

export default SignUpPage;
