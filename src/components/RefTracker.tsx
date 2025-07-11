import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function RefTracker() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get('ref');
    if (ref) {
      localStorage.setItem('pending_ref', ref);
    }
  }, [location]);

  return null;
} 