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
import FocusPage from './pages/FocusPage';
import TemplatesPage from './pages/TemplatesPage';
import AchievementsPage from './pages/AchievementsPage';
import { LayoutDashboard, Book, BarChart2, LogOut, Star, Shield, Timer, Sparkles, Trophy, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import logo from './assets/logo.png';

import Chatbot from './components/Chatbot';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!token) return <Navigate to="/login" replace />;

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/focus', icon: Timer, label: 'Focus' },
    { path: '/journal', icon: Book, label: 'Journal' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/templates', icon: Sparkles, label: 'Templates' },
    { path: '/achievements', icon: Trophy, label: 'Badges' },
    { path: '/subscription', icon: Star, label: 'Pro' }
  ];

  if (user.is_admin) {
    navItems.push({ path: '/admin', icon: Shield, label: 'Admin' });
  }

  // Mobile nav shows only 5 most important items
  const mobileNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
    { path: '/focus', icon: Timer, label: 'Focus' },
    { path: '/journal', icon: Book, label: 'Journal' },
    { path: '/analytics', icon: BarChart2, label: 'Stats' },
    { path: '/subscription', icon: Star, label: 'Pro' }
  ];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#ffffff' }}>
      {/* Desktop Sidebar - Forest Theme */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 flex-col z-50 bg-white border-r border-gray-200">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-gray-200">
          <img src={logo} alt="Habiti" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold text-slate-900 hidden lg:block tracking-tight">habiti</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 flex flex-col items-center lg:items-stretch overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                  ? 'text-[#10b981]'
                  : 'text-slate-500 hover:text-slate-600'
                  }`}
                style={isActive ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' } : {}}
              >
                <div className="p-1.5 rounded-md">
                  <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                <span className="hidden lg:block text-sm font-medium">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-0.5 h-5 rounded-r-full"
                    style={{ backgroundColor: '#10b981' }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-500 hover:text-red-500 transition-all duration-200 justify-center lg:justify-start hover:bg-red-50">
            <LogOut size={18} />
            <span className="hidden lg:block text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header - Forest Theme */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 z-50 px-4 flex items-center justify-between bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Habiti" className="w-7 h-7 object-contain" />
          <span className="text-base font-semibold text-slate-900">habiti</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-500 hover:text-slate-700 transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Full Menu - Forest Theme */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 pt-16 px-4 pb-20 overflow-y-auto bg-white"
          >
            <div className="space-y-1 py-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                      ? 'text-[#10b981]'
                      : 'text-slate-500 hover:text-slate-600'
                      }`}
                    style={isActive ? { backgroundColor: 'rgba(16, 185, 129, 0.1)' } : {}}
                  >
                    <item.icon size={20} strokeWidth={1.5} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-slate-500 hover:text-red-500 rounded-lg transition-colors hover:bg-red-50"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - Forest Theme */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 px-2 flex justify-around items-center bg-white border-t border-gray-200">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all min-w-[56px] ${isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-20 lg:ml-64 pt-16 md:pt-0 p-4 md:p-6 lg:p-8 pb-20 md:pb-8 overflow-y-auto w-full max-w-[1400px] mx-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Chatbot - Available on all devices */}
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
          <Route path="/focus" element={<FocusPage />} />
          <Route path="/journal" element={<JournalPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
