import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  Sparkles, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Activity, 
  Utensils, 
  ShoppingCart, 
  MessageSquareHeart, 
  BarChart3, 
  CalendarCheck, 
  PhoneCall, 
  HeartHandshake,
  Check
} from 'lucide-react';

export function Navbar({ activePage, onNavigate, onOpenDailyAssessment }) {
  const { currentUser, userProfile, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'assessment', label: 'Daily Assessment', icon: CalendarCheck, action: onOpenDailyAssessment },
    { id: 'meals', label: 'Meal Planner', icon: Utensils },
    { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
    { id: 'assistant', label: 'AI Companion', icon: MessageSquareHeart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'contacts', label: 'Trusted Contacts', icon: HeartHandshake }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 via-emerald-600 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 3.5 1.8 6.6 4.6 8.4" />
                  <path d="M12 2c5.5 0 10 4.5 10 10 0 3.5-1.8 6.6-4.6 8.4" />
                  <path d="M7 12h3l2-4 3 8 2-4h2" />
                </svg>
              </div>
              <div className="text-left">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-display">
                  Intel<span className="text-emerald-600">Well</span>
                </span>
                <span className="block text-[9px] font-semibold text-slate-400 tracking-wider uppercase -mt-1">
                  Adaptive Wellness
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.action) item.action();
                      else onNavigate(item.id);
                    }}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer
                      ${isActive 
                        ? 'bg-emerald-50 text-emerald-700 font-bold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-3">

            {/* Notification Drawer Button */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Notifications &amp; Reminders</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                      {unreadCount} unread
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-slate-800">{notif.title}</p>
                          <span className="text-[10px] text-slate-400">{notif.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px] mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100 text-center">
                    <button
                      onClick={() => {
                        onNavigate('notifications');
                        setShowNotifMenu(false);
                      }}
                      className="text-xs text-emerald-600 font-semibold hover:underline"
                    >
                      Notification Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile / Settings Button */}
            <button
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                activePage === 'profile' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title="Profile &amp; Settings"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (item.action) item.action();
                  else onNavigate(item.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Active: {userProfile?.name}</span>
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
                onNavigate('landing');
              }}
              className="text-xs text-rose-600 font-semibold flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
