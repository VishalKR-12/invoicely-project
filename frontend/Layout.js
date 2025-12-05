import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, FileText, Bell, Moon, Sun } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 fixed h-full z-10 hidden md:block transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl">
            <FileText className="w-6 h-6" />
            <span>Invoicely</span>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" active={isActive('/')} />
          <NavItem to="/upload" icon={UploadCloud} label="Upload & Process" active={isActive('/upload')} />
          <NavItem to="/invoices" icon={FileText} label="All Invoices" active={isActive('/invoices')} />
          <NavItem to="/documentation" icon={FileText} label="Documentation" active={isActive('/documentation')} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              AD
            </div>
            <div className="text-sm">
              <p className="font-medium dark:text-white">Admin User</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">admin@company.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-8 sticky top-0 z-20 transition-colors">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">
            {isActive('/') ? 'Overview' : 
             isActive('/upload') ? 'Upload & Process' :
             isActive('/invoices') ? 'Invoice Management' : 'Page'}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
              className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <button className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function NavItem({ to, icon: Icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
        ${active 
          ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
      {label}
    </Link>
  );
}