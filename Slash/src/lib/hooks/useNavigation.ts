import { useNavigate } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    scrollToTop();
    navigate(path);
  };

  return { navigateTo };
}; 