"use client";

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, Activity, Stethoscope, Award, MapPin, DollarSign, ShieldAlert } from 'lucide-react';

// ============================================================================
// PRODUCTION SETUP (Uncomment these when copying to your local Next.js project):
// ============================================================================
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';

export default function DoctorRegisterPage() {
  // ============================================================================
  // PRODUCTION: use real Next router + Supabase client
  // ============================================================================
  const router = useRouter();
  const supabase = createClient();


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // TypeScript Fix: Explicitly cast e.currentTarget to HTMLFormElement
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const licenseNumber = formData.get('licenseNumber') as string;
    const specialty = formData.get('specialty') as string;
    const clinicInfo = formData.get('clinicInfo') as string;
    const consultationFee = formData.get('consultationFee') as string;

    try {
      // Create user inside Supabase Auth, which fires the SQL Trigger to populate public tables
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            role: 'doctor',
            first_name: firstName,
            last_name: lastName,
            license_number: licenseNumber,
            specialty,
            clinic_info: clinicInfo,
            consultation_fee: parseFloat(consultationFee) || 0.0,
          },
        },
      });

      if (authError) {
        throw new Error((authError as any).message ?? 'Sign up failed');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during verification.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 border text-center transition-all duration-300 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-6">
          <Award size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Credentials Submitted</h2>
        <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Your credentials and license details have been successfully received. Administrator verification typically takes 24-48 business hours. You'll receive a confirmation email once your account is fully active.
        </p>
        <button
          onClick={() => router.push('/')}
          className="mt-6 w-full py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg rounded-2xl shadow-xl p-8 border transition-all duration-300 bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
      <div className="text-center mb-6">
        <div
          onClick={() => router.push('/')}
          className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 cursor-pointer hover:scale-105 transition-transform bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
        >
          <Stethoscope size={24} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Join Doctor Network</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Apply to verify client records & consult on MedVault
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Core Credentials */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">First Name</label>
            <input required type="text" name="firstName" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Last Name</label>
            <input required type="text" name="lastName" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-slate-400" />
              </div>
              <input required type="email" name="email" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="doctor@hospital.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-slate-400" />
              </div>
              <input required type="password" name="password" minLength={6} className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="Min. 6 characters" />
            </div>
          </div>
        </div>

        {/* Licensing & Specialty Group */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
            <Award size={14} />
            Professional Credentials
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Medical License Number</label>
              <input required type="text" name="licenseNumber" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="e.g. MD-123456" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Specialty Area</label>
              <select name="specialty" className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white">
                <option value="General Medicine">General Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Neurology">Neurology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Practice & Fees Group */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Clinic Location / Info</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin size={16} className="text-slate-400" />
              </div>
              <input required type="text" name="clinicInfo" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="e.g. St. Jude Hospital, Rm 302" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1 text-slate-500 dark:text-slate-400">Consultation Fee ($)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign size={16} className="text-slate-400" />
              </div>
              <input required type="number" name="consultationFee" min="0" step="0.01" className="block w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 text-sm bg-slate-50 dark:bg-slate-900 border-gray-300 dark:border-slate-800 text-slate-900 dark:text-white" placeholder="50.00" />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-100 dark:border-red-900/40">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
        >
          {isLoading ? 'Submitting Application...' : 'Apply as Practitioner'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400 mt-6">
        Already have an account? <button onClick={() => router.push('/login')} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Log in</button>
      </p>
    </div>
  );
}