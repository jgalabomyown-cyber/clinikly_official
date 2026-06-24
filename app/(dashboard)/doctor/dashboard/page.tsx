"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { 
  Award, 
  CheckCircle, 
  Info, 
  Clock, 
  Stethoscope, 
  Calendar,
  DollarSign,
  AlertCircle,
  Activity,
  ChevronDown
} from 'lucide-react';
export default function DoctorDashboard() {
  const supabase = createClient();
  
  const [profile, setProfile] = useState<any>(null);
  const [queue, setQueue] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('ACTIVE');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchDoctorData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Doctor Profile
        const { data: profileData } = await supabase
          .from('doctor_profiles')
          .select('*, users(first_name, last_name, email)')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          setStatus(profileData.status || 'ACTIVE');
        }

        // Fetch records assigned to this doctor that are in 'PENDING' status
        const { data: queueData } = await supabase
          .from('medical_records')
          .select('*, users:patient_id(first_name, last_name)')
          .eq('assigned_doctor_id', user.id)
          .eq('status', 'PENDING');

        setQueue(queueData || []);

        const { data: appointmentData } = await supabase
          .from('appointments')
          .select('*, users:patient_id(first_name, last_name)')
          .eq('doctor_id', user.id)
          .in('status', ['ACCEPTED', 'PENDING']);

        setAppointments(appointmentData || []);
      } catch (err) {
        console.error("Error retrieving medical queue:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDoctorData();
  }, []);

  const handleStatusChange = async (newStatus: string) => {
    const oldStatus = status;
    setStatus(newStatus); // Optimistic Update for smooth UI response
    setIsUpdatingStatus(true);
    setStatusError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated session found.");

      // Perform real-time update write inside Supabase database (uppercase enum fallback check)
      const { error } = await supabase
        .from('doctor_profiles')
        .update({ status: newStatus })
        .eq('id', user.id);

      if (error) {
        // If uppercase fails, gracefully attempt lowercase write compatibility check
        const { error: fallbackError } = await supabase
          .from('doctor_profiles')
          .update({ status: newStatus.toLowerCase() })
          .eq('id', user.id);
          
        if (fallbackError) throw fallbackError;
      }
    } catch (err: any) {
      console.error("Failed to persist clinical status:", err);
      setStatus(oldStatus); // Revert status locally on network/DB failure
      setStatusError(err.message || "Failed to save status changes to database.");
      setTimeout(() => setStatusError(null), 5000);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleReviewAction = async (id: string, action: 'APPROVED' | 'REVISION_REQUESTED') => {
    try {
      const { error } = await supabase
        .from('medical_records')
        .update({ status: action })
        .eq('id', id);

      if (error) throw error;

      // Filter local state instantly to provide responsive UI feedback
      setQueue(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to commit verification state:", err);
    }
  };

  const getStatusDotColor = (val: string) => {
    switch (val) {
      case 'ACTIVE': return 'bg-emerald-500';
      case 'BUSY': return 'bg-amber-500';
      case 'AWAY': return 'bg-slate-500';
      case 'BREAK': return 'bg-sky-500';
      case 'LUNCH': return 'bg-indigo-500';
      case 'DAY_OFF': return 'bg-rose-500';
      default: return 'bg-slate-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-semibold text-slate-400">Loading Clinical Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome & Status Header Block */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 border-b pb-5 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Clinical Verification Hub</h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit patient-submitted medical artifacts, review diagnostics, and secure verified health histories.
          </p>
        </div>

        {/* Dynamic Custom Status Dropdown Panel */}
        <div className="flex flex-col gap-2 relative">
          <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">
            Shift Status:
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold uppercase border transition-all shadow-xs ${
                isUpdatingStatus ? 'opacity-60 cursor-not-allowed' : ''
              } bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95`}
            >
              <span className={`w-2 h-2 rounded-full ${getStatusDotColor(status)} ${status === 'ACTIVE' ? 'animate-ping' : ''}`} />
              {status.replace('_', ' ')}
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <>
                {/* Backdrop cover to catch click-outside and trigger menu close */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                
                {/* Float Options List Wrapper */}
                <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xl z-20 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                  <div className="py-1">
                    {(['ACTIVE', 'BUSY', 'AWAY', 'BREAK', 'LUNCH', 'DAY_OFF'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          handleStatusChange(s);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[10px] font-bold uppercase text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                          status === s 
                            ? 'text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/40' 
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(s)}`} />
                        {s.replace('_', ' ')}
                        {status === s && (
                          <span className="ml-auto w-1 h-1 rounded-full bg-slate-900 dark:bg-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {statusError && (
            <span className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
              <AlertCircle size={12} /> {statusError}
            </span>
          )}
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Audit Queue</p>
          <p className="text-2xl font-black mt-1 text-amber-500">{queue.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Pending uploads requiring reviews</p>
        </div>
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Consultations</p>
          <p className="text-2xl font-black mt-1 text-purple-500">{appointments.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">Active scheduled appointments</p>
        </div>
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Patient List</p>
          <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            ${profile?.consultation_fee || '0.00'} / hr
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Patients tracked in clinic database</p>
        </div>
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Specialty Verification</p>
          <p className="text-sm font-black mt-2 text-emerald-500 uppercase tracking-wide">
            {profile?.specialty || 'General Medicine'}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">License Verified: {profile?.license_number}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Verification Queue Module */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award size={15} className="text-emerald-500" />
            Patient Document Verification Queue (Module 5)
          </h2>

          {queue.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle size={32} className="mx-auto text-emerald-500 mb-2" />
              <p className="text-xs font-semibold">Verification Queue is Clean.</p>
              <p className="text-[10px] text-slate-400 mt-1">All submitted documents have been processed and locked.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queue.map((item) => (
                <div 
                  key={item.id} 
                  className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black">{item.file_url.split('/').pop() || 'Medical Record'}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                          {item.record_type}
                        </span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-400">
                        Patient Name: <span className="text-slate-900 dark:text-white font-bold">{item.users?.first_name || 'Anonymous'} {item.users?.last_name || ''}</span>
                      </p>
                    </div>

                    {/* Decision Action Triggers */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleReviewAction(item.id, 'APPROVED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                      <button 
                        onClick={() => handleReviewAction(item.id, 'REVISION_REQUESTED')}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[10px] flex items-center gap-1"
                      >
                        <Info size={12} /> Request Revision
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Schedule */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-500 mb-4 flex items-center gap-1.5">
              <Calendar size={14} />
              Today's Schedule
            </h3>
            {appointments.length === 0 ? (
              <p className="text-[10px] text-slate-400">No appointments scheduled for today.</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {apt.users?.first_name} {apt.users?.last_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {apt.start_time ? `${apt.start_time} - ${apt.end_time}` : 'Scheduled Session'}
                      </p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      apt.status === 'ACCEPTED' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

           {/* Consultation Charge details widget */}
          <div className={`p-5 rounded-2xl border bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-emerald-500 mb-3 flex items-center gap-1.5">
              <DollarSign size={14} />
              Consultation Settings (Module 3)
            </h3>
            <p className="text-[10px] text-slate-400 mb-4">Governs current consultation fee in public directory search queries.</p>
            <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 flex items-center justify-between">
              <span className="text-[10px] font-extrabold">Active Fee Rate</span>
              <span className="text-sm font-black text-emerald-500">$125.00 / hr</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}