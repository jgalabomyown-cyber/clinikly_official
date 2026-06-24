import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Sidebar from '../components/dashboard/Sidebar';
import DevSandboxHelper from '../components/dashboard/DevSandboxHelper';

export default async function DashboardLayout({

  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Enforce active session checks on the Server Component
  const { data: { user }, error: sessionError } = await supabase.auth.getUser();
  if (sessionError || !user) {
    redirect('/login');
  }

  // 2. Query user database record to prevent role metadata spoofing
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('role, first_name, last_name, email')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    redirect('/login');
  }

  const userRole = profile.role as 'patient' | 'doctor' | 'admin';
  const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans transition-colors duration-200">
      
      {/* 1. MOUNT MODULARIZED INTERACTIVE CLIENT SIDEBAR */}
      <Sidebar 
        userRole={userRole} 
        fullName={fullName} 
        email={profile.email || user.email || ''} 
      />

      {/* 2. PROTECTED WORKSPACE CANVAS INJECTION */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* 3. FLOATING COLLAPSIBLE DEVELOPMENT SANDBOX TOOLBAR */}
      <DevSandboxHelper />

    </div>
  );
}