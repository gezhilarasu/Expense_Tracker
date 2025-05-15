// src/components/TokenExpiryCheck.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TokenExpiryCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const expiresAt = localStorage.getItem('expiresAt');

    if (!expiresAt || Date.now() > parseInt(expiresAt)) {
      localStorage.clear();
      navigate('/login');
    } else {
      const timeLeft = parseInt(expiresAt) - Date.now();
      const timer = setTimeout(() => {
        localStorage.clear();
        navigate('/login');
      }, timeLeft);

      return () => clearTimeout(timer);
    }
  }, [navigate]);

  return null; 
};

export default TokenExpiryCheck;
