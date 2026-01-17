import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import JournalPage from './pages/JournalPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPage from './pages/AdminPage';
import { LayoutDashboard, Book, BarChart2, LogOut, Star, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from './assets/logo.png';

import Chatbot from './components/Chatbot';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();

  if (!token) return <Navigate to="/login" replace />;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/journal', icon: Book, label: 'Journal' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/subscription', icon: Star, label: 'Upgrade' }
  ];

  if (user.is_admin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Dark Glass Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-24 lg:w-72 bg-slate-900/40 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-500 shadow-2xl shadow-black/40">
        <div className="p-8 flex items-center justify-center lg:justify-start gap-3">
          <img src={logo} alt="Habiti" className="w-10 h-10 object-contain drop-shadow-md" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 hidden lg:block tracking-tight font-sans">habiti</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 flex flex-col items-center lg:items-stretch">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                  ? 'text-teal-400 bg-white/5 shadow-md shadow-black/20 border border-white/5 scale-[1.02]'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-teal-400/10 text-teal-400' : 'bg-transparent group-hover:bg-white/5'}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="hidden lg:block font-medium text-sm tracking-wide">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-teal-400 rounded-r-full lg:hidden"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }} className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group justify-center lg:justify-start">
            <LogOut size={20} className="group-hover:scale-110 transition-transform" />
            <span className="hidden lg:block font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-20 md:ml-24 lg:ml-72 p-8 lg:p-12 overflow-y-auto w-full max-w-[1600px] mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Chatbot />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Catch all - redirect to Landing if not found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
