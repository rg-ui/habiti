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
    <div className="min-h-screen flex bg-zinc-950">
      {/* Desktop Sidebar - Minimalist */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 bg-zinc-950 border-r border-zinc-900 flex-col z-50">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-zinc-900">
          <img src={logo} alt="Habiti" className="w-8 h-8 object-contain" />
          <span className="text-xl font-semibold text-zinc-100 hidden lg:block tracking-tight">habiti</span>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 flex flex-col items-center lg:items-stretch overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                  ? 'text-teal-400 bg-teal-500/10'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                  }`}
              >
                <div className={`p-1.5 rounded-md ${isActive ? '' : ''}`}>
                  <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                </div>
                <span className="hidden lg:block text-sm font-medium">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 w-0.5 h-5 bg-teal-500 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-900">
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-zinc-600 hover:bg-zinc-900 hover:text-red-400 transition-all duration-200 justify-center lg:justify-start">
            <LogOut size={18} />
            <span className="hidden lg:block text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header - Minimalist */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-zinc-950 border-b border-zinc-900 z-50 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Habiti" className="w-7 h-7 object-contain" />
          <span className="text-base font-semibold text-zinc-100">habiti</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Full Menu - Minimalist */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-zinc-950 z-40 pt-16 px-4 pb-20 overflow-y-auto"
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
                      ? 'bg-teal-500/10 text-teal-400'
                      : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                      }`}
                  >
                    <item.icon size={20} strokeWidth={1.5} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}

              <div className="pt-4 mt-4 border-t border-zinc-900">
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full text-zinc-600 hover:bg-zinc-900 hover:text-red-400 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation - Minimalist */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-zinc-900 z-50 px-2 flex justify-around items-center">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-all min-w-[56px] ${isActive ? 'text-teal-400' : 'text-zinc-600'}`}
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
