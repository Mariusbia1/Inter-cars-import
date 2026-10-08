import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';

export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    const hasLastVehicle = typeof window !== 'undefined' && sessionStorage.getItem('last_viewed_vehicle_id');

    // Si retour arrière vers le catalogue avec mémorisation de l'élément cliqué,
    // laisser le catalogue restaurer directement la position sur le véhicule.
    if (navType === 'POP' && hasLastVehicle && (pathname === '/vehicules-disponibles' || pathname === '/')) {
      // Pas de reset forcé au sommet
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }

    // Logger la visite pour les statistiques
    analyticsService.logPageView(pathname);
  }, [pathname, navType]);

  return null;
};
