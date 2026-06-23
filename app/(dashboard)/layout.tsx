"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [userRole, setUserRole] = useState<string>('patient');
  const [currentView, setCurrentView] = useState<'patient' | 'doctor'>('patient');

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Read role from Supabase metadata
        const role = user.user_metadata?.role || 'patient';
        setUserRole(role);
      }
    };
    fetchUserAndRole();
  }, []);

  const handleToggleView = () => {
    if (userRole !== 'doctor') return; // Grayed out logic guards this action

    const nextView = currentView === 'patient' ? 'doctor' : 'patient';
    setCurrentView(nextView);
    
    // Switch between portal route groups seamlessly!
    if (nextView === 'doctor') {
      router.push('/doctor/dashboard');
    } else {
      router.push('/patient/dashboard');
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar with Navigation */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 p-6">
        {/* Toggle Widget */}
        <div className="mb-6 pt-4 border-b pb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Workspace Settings
          </label>
          
          <button
            onClick={handleToggleView}
            disabled={userRole !== 'doctor'}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-sm font-bold transition-all ${
              userRole === 'doctor'
                ? 'bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-900 cursor-pointer'
                : 'bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-900/40 dark:border-slate-800 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Switch Portal</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border uppercase">
              {currentView}
            </span>
          </button>
          
          {userRole !== 'doctor' && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 pl-1">
              * Switch disabled. Requires a verified practitioner account.
            </p>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}