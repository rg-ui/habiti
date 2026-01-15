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
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Glassmorphic Sidebar */}
      {/* Minimal Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-24 lg:w-72 bg-white/50 backdrop-blur-2xl border-r border-white/50 flex flex-col z-50 transition-all duration-500 shadow-2xl shadow-slate-200/50">
        <div className="p-8 flex items-center justify-center lg:justify-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-xl ring-4 ring-white/50">
            H
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 hidden lg:block tracking-tight">Habiti</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-3 flex flex-col items-center lg:items-stretch">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${isActive
                  ? 'text-indigo-600 bg-white shadow-md shadow-indigo-100/50 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-900 hover:bg-white/60'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-transparent group-hover:bg-slate-100'}`}>
                  <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="hidden lg:block font-medium text-sm tracking-wide">{item.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 w-1 h-8 bg-indigo-600 rounded-r-full lg:hidden"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100/50">
          <button onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }} className="flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group justify-center lg:justify-start">
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
