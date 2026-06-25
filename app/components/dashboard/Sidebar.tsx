"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Stethoscope, 
  LogOut, 
  HeartPulse, 
  Activity,
  FileText,
  Calendar,
  ChevronRight,
  Sun,
  Moon,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  userRole: 'patient' | 'doctor' | 'admin';
  fullName: string;
  email: string;
}

export default function Sidebar({ userRole, fullName, email }: SidebarProps) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
    setTheme(initialTheme);

    if (initialTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

  useEffect(() => {
    const handler = () => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      const nextTheme = savedTheme === 'dark' ? 'dark' : 'light';
      setTheme(nextTheme);

      if (nextTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between min-h-screen transition-colors duration-200">
      <div className="space-y-6">
        
        {/* Platform Branding & Global Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs ${userRole === 'doctor' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
              {userRole === 'doctor' ? <Stethoscope size={18} /> : <HeartPulse size={18} />}
            </div>
            <div>
              <span className="font-extrabold text-md tracking-tight block dark:text-white">MedVault</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Portal</span>
            </div>
          </div>
          
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-95"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white relative ${userRole === 'doctor' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
            {userRole === 'doctor' ? <Stethoscope size={20} /> : <User size={20} />}
            <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate dark:text-slate-200">{fullName}</p>
            <span className={`text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${userRole === 'doctor' ? 'text-emerald-500' : 'text-blue-500'}`}>
              <ShieldCheck size={10} /> {userRole} Account
            </span>
          </div>
        </div>

        {/* Dynamic Navigation Links based on DB Role */}
        <nav className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 px-2 tracking-wider">Main Workspace</span>
          
          <Link 
            href={userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard'}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
              isActive(userRole === 'doctor' ? '/doctor' : '/patient')
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Activity size={15} />
              Dashboard Home
            </span>
            <ChevronRight size={12} />
          </Link>

          {userRole === 'patient' ? (
            <>
              <Link 
                href="/patient/records"
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/patient/records')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <FileText size={15} />
                My Health Records
              </Link>
              <Link 
                href="/patient/appointments"
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/patient/appointments')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Calendar size={15} />
                Book Consultations
              </Link>
            </>
          ) : (
            <>
              <Link 
                href="/doctor/approvals"
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/doctor/approvals')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <FileText size={15} />
                Verification Queue
              </Link>
              <Link 
                href="/doctor/calendar"
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive('/doctor/calendar')
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Calendar size={15} />
                Appointment Schedule
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Logout Action Form */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
        <form action="/auth/signout" method="post">
          <button 
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut size={15} />
            Disconnect Session
          </button>
        </form>
      </div>
    </aside>
  );
}