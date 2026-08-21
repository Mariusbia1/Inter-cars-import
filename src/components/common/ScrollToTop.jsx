import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });

    // Logger la visite pour les statistiques
    analyticsService.logPageView(pathname);
  }, [pathname]);

  return null;
};
