"use client";

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Mail,
  Lock,
  Activity,
  User,
  Stethoscope,
  Award,
} from 'lucide-react';
// ============================================================================
// PRODUCTION IMPORTS (Uncomment these when copying to your Next.js project):
// ============================================================================
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  /*const router = useRouter();
  const supabase = {
    auth: {
      signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        if (password === 'wrong') {
          return { data: { user: null }, error: { message: 'Incorrect password. Please try again.' } };
        }

        return {
          data: {
            user: {
              email,
              user_metadata: { role: email.toLowerCase().includes('doctor') ? 'doctor' : 'patient' }
            }
          },
          error: null
        };
      }
    },
    rpc: async (fnName: string, args: { p_license_number: string }) => {
      await new Promise((resolve) => setTimeout(resolve,1000));
      if (fnName === 'get_doctor_email_by_license') {
        if (args.p_license_number === 'MD-PENDING') {
          return {
            data: [{
              email: 'pending_doctor@medvault.com',
              specialty: 'Cardiology',
              is_verified: false
            }],
            error: null
          };
        }
        if (args.p_license_number === 'MD-EXPIRED') {
          return { data: [], error: null };
        }
        return {
          data: [{
            email: 'verified_doctor@medvault.com',
            specialty: 'Cardiology',
            is_verified: true
          }],
          error: null
        };
      }
      return { data: null, error: { message: 'Function not found.' } };
    }
  };*/
  
  // Loading and Error States
  const [activeTab, setActiveTab] = useState<'standard' | 'doctor_license'>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handling email/password sign-in logic
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // TypeScript Fix: Explicitly cast e.currentTarget to HTMLFormElement
    const formData = new FormData(e.currentTarget as HTMLFormElement);


    try {
      if (activeTab === 'standard') {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        const userRole = data.user?.user_metadata?.role ?? 'patient';
        if (userRole === 'doctor') {
          router.push('/doctor/dashboard');
        } else {
          router.push('/patient/dashboard');
        }
      } else {
        // --- DOCTOR LICENSE LOGIN FLOW ---
        const licenseNumber = formData.get('licenseNumber') as string;
        const password = formData.get('password') as string;
        const specialty = formData.get('specialty') as string;

        // 1. Resolve license number to user email in the database
        const { data: rpcData, error: lookupError } = await supabase.rpc(
          'get_doctor_email_by_license', 
          {p_license_number: licenseNumber}
        );

        if (lookupError) {
          throw new Error(String((lookupError as { message?: unknown }).message ?? 'Lookup failed'));
        }

        // Get the first matched row from the table response
        const doctorData = rpcData && rpcData[0];

        if (!doctorData) {
          throw new Error('No practitioner account found matching this license number.');
        }

        // 2. Strict Security Check: Enforce administrator verification status
        if (!doctorData.is_verified) {
          throw new Error('Access Denied: Your medical license is still pending administrator verification.');
        }

        // Check if doctor specialty selection matches database record.
        // NOTE: Specialty values in the DB and UI can differ by whitespace/casing/punctuation.
        // We normalize both sides to reduce false mismatches.
        const normalizeSpecialty = (v: string) =>
          v
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .replace(/[^a-z0-9\s]/g, '');

        if (normalizeSpecialty(doctorData.specialty ?? '') !== normalizeSpecialty(specialty ?? '')) {
          throw new Error('Credential mismatch: Selected specialty does not match licensed record.');
        }

        // 2. Perform authentic sign-in using resolved email and password
        const resolvedEmail = doctorData.email;
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: doctorData.email,
          password,
        });

        if (authError) throw new Error(authError.message);

        // 3. Authenticated successfully: Redirect directly to practitioner layout
        router.push('/doctor/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl shadow-xl p-8 border transition-all duration-300 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
      <div className="text-center mb-6">
        <div
          onClick={() => router.push('/')}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        >
          <Activity size={28} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to access your secure medical vault
        </p>
      </div>

      {/* Segmented Controller Tab Switcher */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
        <button
          type="button"
          onClick={() => { setActiveTab('standard'); setError(null); }}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'standard'
              ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <User size={14} />
          Standard Login
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('doctor_license'); setError(null); }}
          className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'doctor_license'
              ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-850'
          }`}
        >
          <Stethoscope size={14} />
          Verified Practitioner
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Form elements for Standard Login */}
        {activeTab === 'standard' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-400">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-slate-400 dark:text-slate-500" />
                </div>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" 
                  placeholder="Enter email address" 
                />
              </div>
            </div>
          </>
        )}

        {/* Form elements for Verified Doctor Login */}
        {activeTab === 'doctor_license' && (
          <>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-400">Medical License Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Award size={16} className="text-emerald-500" />
                </div>
                <input 
                  type="text" 
                  name="licenseNumber" 
                  required 
                  className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white placeholder-emerald-600/40" 
                  placeholder="e.g. MD-123456" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-400">Specialty</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope size={16} className="text-emerald-500" />
                </div>
                <select 
                  name="specialty" 
                  className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="General Medicine">General Medicine</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Neurology">Neurology</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Password field remains common for security verification */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Password</label>
            <button 
              type="button" 
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={16} className="text-slate-400 dark:text-slate-500" />
            </div>
            <input 
              type="password" 
              name="password" 
              required 
              className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" 
              placeholder="Password" 
            />
          </div>
        </div>

        {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-950/20 py-2 px-3 rounded-lg border border-red-100 dark:border-red-950">{error}</p>}

        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            activeTab === 'doctor_license' 
              ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500' 
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {isLoading ? 'Verifying...' : activeTab === 'doctor_license' ? 'Verify License & Access' : 'Sign In'}
        </button>
      </form>

      {/* Alternative registration footer */}
      <div className="mt-6 pt-5 border-t border-gray-100 dark:border-slate-800">
        <p className="text-center text-sm mb-4 text-slate-600 dark:text-slate-400">Need a clinical workspace account?</p>
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => router.push('/register/patient')} 
            className="cursor-pointer flex items-center justify-center gap-1.5 p-2.5 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-blue-500 text-xs font-bold text-slate-950 dark:text-slate-200"
          >
            <User size={14} className="text-blue-500" />
            Patient Registration
          </button>
          <button 
            type="button"
            onClick={() => router.push('/register/doctor')} 
            className="cursor-pointer flex items-center justify-center gap-1.5 p-2.5 border rounded-xl hover:scale-[1.01] active:scale-[0.99] transition-all bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-xs font-bold text-slate-950 dark:text-slate-200"
          >
            <Stethoscope size={14} className="text-emerald-500" />
            Apply as Doctor
          </button>
        </div>
	<div className="text-center mt-6">
        <button 
          onClick={() => router.push('/')} 
          className="text-sm transition-colors underline text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
        >
          Back to Homepage
        </button>
      </div>
    	</div>
      </div>
  );
}      