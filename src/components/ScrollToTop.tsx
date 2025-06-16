import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

<<<<<<< Anirudh
const ScrollToTop = () => {
=======
export default function ScrollToTop() {
>>>>>>> main
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
<<<<<<< Anirudh
};

export default ScrollToTop; 
=======
} 
>>>>>>> main
