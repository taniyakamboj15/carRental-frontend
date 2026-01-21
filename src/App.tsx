import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { MainLayout } from '@/layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from '@/components/common/PageTransition';

import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Home } from '@/pages/Home';
import { Vehicles } from '@/pages/Vehicles';
import { BookingHistory } from '@/pages/BookingHistory';

const queryClient = new QueryClient();

// Layout Wrapper
const LayoutWrapper = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public/Auth Routes (No Main Navbar) */}
        <Route path="/login" element={
          <PageTransition>
            <Login />
          </PageTransition>
        } />
        <Route path="/register" element={
          <PageTransition>
            <Register />
          </PageTransition>
        } />

        {/* Main App Routes (With Navbar) */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={
            <PageTransition>
              <Home />
            </PageTransition>
          } />
          <Route path="/vehicles" element={
            <PageTransition>
              <Vehicles />
            </PageTransition>
          } />
          <Route path="/bookings" element={
            <PageTransition>
              <BookingHistory />
            </PageTransition>
          } />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
  );
}

export default App;
