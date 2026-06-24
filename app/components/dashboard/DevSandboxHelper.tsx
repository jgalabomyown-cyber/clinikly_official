"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sliders, RefreshCw, Layers, CheckCircle } from 'lucide-react';

export default function DevSandboxHelper() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Exclude this utility from production compilations automatically
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl font-bold text-xs transition-transform hover:scale-105 active:scale-95 border border-indigo-500"
        >
          <Sliders size={14} className="animate-pulse" />
          Dev Sandbox Tools
        </button>
      ) : (
        <div className="w-64 rounded-2xl border bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-950 shadow-2xl p-4 text-slate-800 dark:text-white space-y-3.5">
          <div className="flex items-center justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider flex items-center gap-1">
              <Layers size={11} /> Sandbox Controller
            </span>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              Minimize
            </button>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Active Location Path</span>
            <code className="block p-1.5 rounded-md bg-slate-50 dark:bg-slate-950 text-[10px] font-mono border dark:border-slate-850 truncate text-slate-600 dark:text-slate-300">
              {pathname}
            </code>
          </div>

          <div className="space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Bypass Portal (Test Route Switcher)</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => router.push('/patient/dashboard')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                  pathname.startsWith('/patient') 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
              >
                /patient
              </button>
              <button 
                onClick={() => router.push('/doctor/dashboard')}
                className={`py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all ${
                  pathname.startsWith('/doctor') 
                    ? 'bg-emerald-600 text-white border-emerald-500' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
              >
                /doctor
              </button>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-500/5 rounded-xl border border-dashed border-indigo-500/15 text-[9px] text-slate-500 leading-relaxed">
            Note: In production, access is strictly guarded by server middleware checks. Use these paths for testing UI templates on your local workspace.
          </div>
        </div>
      )}
    </div>
  );
}