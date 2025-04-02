'use client';

import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const cookies = document.cookie;
    const authToken = cookies.split(';').find(cookie => cookie.trim().startsWith('authToken='));

    if (authToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated as boolean;
};

export default useAuth;
