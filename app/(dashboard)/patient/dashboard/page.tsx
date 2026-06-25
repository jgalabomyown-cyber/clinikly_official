"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
// Add Link from next/link for local routing
import Link from 'next/link';
import { 
  FileText, 
  Calendar, 
  Phone, 
  Upload, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Info, 
  UserPlus,
  ArrowRight,
  Shield,
  FolderOpen
} from 'lucide-react';

export default function PatientDashboard() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPatientData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch profile
        const { data: profileData } = await supabase
          .from('patient_profiles')
          .select('*, users(first_name, last_name, email)')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        // Fetch timeline records
        const { data: recordData } = await supabase
          .from('medical_records')
          .select('*')
          .eq('patient_id', user.id)
          .order('upload_date', { ascending: false });

        setRecords(recordData || []);
      } catch (err) {
        console.error("Error retrieving medical profile details:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPatientData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-semibold text-slate-400">Loading Medical Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Welcome Board */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-black tracking-tight">Patient Health Workspace</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage secure cryptographic file vaults, track physical credentials, and coordinate consultation diaries.
        </p>
      </div>

      {}
      {/* QUICK NAVIGATION PANEL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link 
          href="/patient/records"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2 w-fit rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                <FolderOpen size={18} />
              </div>
              <h3 className="text-sm font-black mt-3 dark:text-white">Go to Records Vault</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Upload new diagnostic sheets, organize files by type, and monitor verification audits.
              </p>
            </div>
            <span className="p-2 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
              <ArrowRight size={14} />
            </span>
          </div>
        </Link>

        <Link 
          href="/patient/appointments"
          className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all group text-left"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="p-2 w-fit rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <Calendar size={18} />
              </div>
              <h3 className="text-sm font-black mt-3 dark:text-white">Book Consultations</h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Search verified clinical specialists, view real-time availability fees, and reserve slots.
              </p>
            </div>
            <span className="p-2 rounded-full bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">
              <ArrowRight size={14} />
            </span>
          </div>
        </Link>
      </div>

      {/* Patient Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Health Files</p>
          <p className="text-2xl font-black mt-1">{records.length}</p>
          <p className="text-[10px] text-slate-400 mt-1">AES-256 Registered Files</p>
        </div>
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Audits</p>
          <p className="text-2xl font-black mt-1 text-emerald-500">
            {records.filter(r => r.status === 'APPROVED').length}
          </p>
          <p className="text-[10px] text-slate-400 mt-1">Audit-ready medical timeline</p>
        </div>
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Bookings</p>
          <p className="text-2xl font-black mt-1 text-blue-500">0</p>
          <p className="text-[10px] text-slate-400 mt-1">Scheduled appointments today</p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Document Vault Timeline */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText size={15} className="text-blue-500" />
            Medical Vault & Document Timeline
          </h2>

          {records.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Clock size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="text-xs font-semibold">Your Medical Vault is Empty.</p>
              <p className="text-[10px] text-slate-400 mt-1">Upload files to begin building your clinical timeline history.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((rec) => (
                <div 
                  key={rec.id} 
                  className="p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs font-black">{rec.file_url.split('/').pop() || 'Medical Record'}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                          {rec.record_type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium">Uploaded on: {new Date(rec.upload_date).toLocaleDateString()}</p>
                    </div>

                    {/* Verification Status */}
                    <div>
                      {rec.status === 'APPROVED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 size={10} /> Verified
                        </span>
                      )}
                      {rec.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock size={10} /> Pending Review
                        </span>
                      )}
                      {rec.status === 'REVISION_REQUESTED' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          <XCircle size={10} /> Revision Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Demographics Summary Card */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-500 mb-4 flex items-center gap-1.5">
              <Phone size={14} />
              Emergency Biological Profile
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Blood Group</span>
                  <span className="font-black text-rose-500 mt-0.5 block text-sm">
                    {profile?.blood_type || 'Unspecified'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Allergies</span>
                  <span className="font-black text-slate-900 dark:text-white mt-0.5 block truncate">
                    {profile?.allergies || 'None Identified'}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 space-y-1.5">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Emergency Contact</p>
                <p className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {profile?.emergency_contact_name || 'None Set'}
                </p>
                <p className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Phone size={10} /> {profile?.emergency_contact_phone || 'Unspecified'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}