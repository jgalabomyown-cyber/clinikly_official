"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Activity, User, Phone, Calendar, Heart, AlertTriangle } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';

export default function PatientRegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const birthdate = formData.get('birthdate') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const emergencyContactName = formData.get('emergencyContactName') as string;
    const emergencyContactPhone = formData.get('emergencyContactPhone') as string;

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: 'patient',
            first_name: firstName,
            last_name: lastName,
            birthdate,
            contact_number: contactNumber,
            emergency_contact_name: emergencyContactName,
            emergency_contact_phone: emergencyContactPhone,
          },
        },
      });

      if (authError) {
        // Make sure we surface the underlying DB/trigger error if Supabase provides it.
        const message = authError.message ?? authError.name ?? 'Sign up failed';
        const maybeDetails = (authError as { details?: string }).details;
        const maybeHint = (authError as { hint?: string }).hint;
        throw new Error([message, maybeDetails, maybeHint].filter(Boolean).join(' | '));
      }

      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 border text-center transition-all duration-300 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-6">
          <Activity size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Check Your Email</h2>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          We have sent a verification link to your registered email address. Please verify your account to unlock your dashboard.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-6 w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Proceed to Login
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl shadow-xl p-8 border transition-all duration-300 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
      <div className="text-center mb-6">
        <div
          onClick={() => router.push('/')}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
        >
          <Activity size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Patient Account</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Set up your secure profile & personal health vault
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Core Credentials */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">First Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={16} className="text-slate-400" />
              </div>
              <input required type="text" name="firstName" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Last Name</label>
            <input required type="text" name="lastName" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input required type="email" name="email" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="you@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-400" />
              </div>
              <input required type="password" name="password" minLength={6} className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="Min. 6 characters" />
            </div>
          </div>
        </div>

        {/* Bio Details */}
        <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Birthdate</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-slate-400" />
              </div>
              <input required type="date" name="birthdate" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Contact Phone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-slate-400" />
              </div>
              <input required type="tel" name="contactNumber" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="e.g. +12345678" />
            </div>
          </div>
        </div>

        {/* Emergency Contact Group */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-1.5">
            <Heart size={14} />
            Emergency Contact Information
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Contact Name</label>
              <input required type="text" name="emergencyContactName" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="Primary Guardian / Spouse" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Contact Phone</label>
              <input required type="tel" name="emergencyContactPhone" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="Emergency contact number" />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/40">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {isLoading ? 'Creating Account...' : 'Register as Patient'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Already have an account? <button onClick={() => router.push('/login')} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Log in</button>
      </p>
    </div>
  );
}