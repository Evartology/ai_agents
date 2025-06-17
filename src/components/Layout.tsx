import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, Scale, DollarSign, Grid3X3, TrendingUp, Newspaper, Bot } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/comparison', icon: Scale, label: 'Compare' },
    { path: '/pricing', icon: DollarSign, label: 'Pricing' },
    { path: '/features', icon: Grid3X3, label: 'Features' },
    { path: '/performance', icon: TrendingUp, label: 'Performance' },
    { path: '/news', icon: Newspaper, label: 'Latest News' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AI Agents Hub</h1>
                <p className="text-xs text-slate-600">Comprehensive Comparison Platform</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? 'bg-blue-100 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white border-b border-slate-200">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400">
              © 2025 AI Agents Hub. Research Date: June 17, 2025 | 106+ Sources Verified
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Comprehensive analysis of leading AI agent platforms for informed decision-making
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
