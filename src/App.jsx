import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { VehicleProvider } from './context/VehicleContext';
import { LeadsProvider } from './context/LeadsContext';
import { ScrollToTop } from './components/common/ScrollToTop';

import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { FloatingCallButton } from './components/common/FloatingCallButton';

// Pages Publiques
import { HomePage } from './pages/HomePage';
import { HistoryPage } from './pages/HistoryPage';
import { MethodPage } from './pages/MethodPage';
import { GuaranteesPage } from './pages/GuaranteesPage';
import { DeliveredVehiclesPage } from './pages/DeliveredVehiclesPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Pages Espace Admin
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

// Composant de contrôle de Layout (Navbar / Footer masqués sur /admin et /login)
const MainContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/notre-histoire" element={<HistoryPage />} />
          <Route path="/notre-methode" element={<MethodPage />} />
          <Route path="/garanties" element={<GuaranteesPage />} />
          <Route path="/vehicules-livres" element={<DeliveredVehiclesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Pages Légales */}
          <Route path="/mentions-legales" element={<LegalPage />} />
          <Route path="/confidentialite" element={<LegalPage />} />
          <Route path="/cgv" element={<LegalPage />} />

          {/* Espace Admin & Alias /login */}
          <Route path="/login" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />

          {/* Route 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <FloatingCallButton />}
    </div>
  );
};

export function App() {
  return (
    <ToastProvider>
      <SettingsProvider>
        <AdminAuthProvider>
          <VehicleProvider>
            <LeadsProvider>
              <Router>
                <ScrollToTop />
                <MainContent />
              </Router>
            </LeadsProvider>
          </VehicleProvider>
        </AdminAuthProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}

export default App;
