"use client";

import React, { useState } from 'react';
import { 
  User, 
  Stethoscope, 
  Activity, 
  MapPin, 
  DollarSign, 
  Award, 
  Bell, 
  LogOut, 
  ShieldCheck, 
  HeartPulse, 
  Moon, 
  Sun, 
  Save, 
  CheckCircle, 
  RefreshCw, 
  Calendar, 
  Phone, 
  FileText, 
  Upload, 
  Search, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  Eye, 
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Simulated live database states for Alex Mercer (Patient) and Dr. Gregory House (Doctor)
const MOCK_PATIENT_RECORDS = [
  { id: 'rec-1', name: 'Blood Chemistry Panel (CBC)', type: 'Lab Result', date: '2026-05-14', doctor: 'Dr. Gregory House', status: 'approved', url: '#' },
  { id: 'rec-2', name: 'Chest X-Ray Imaging', type: 'Radiology', date: '2026-06-02', doctor: 'Dr. Allison Cameron', status: 'pending', url: '#' },
  { id: 'rec-3', name: 'COVID-19 Booster Vaccination', type: 'Immunization', date: '2025-11-20', doctor: 'St. Jude Clinic Staff', status: 'approved', url: '#' },
  { id: 'rec-4', name: 'Lipid Panel Update', type: 'Lab Result', date: '2026-06-20', doctor: 'Dr. Gregory House', status: 'revision_requested', feedback: 'Page 2 scan is blurry. Please re-upload.', url: '#' }
];

const MOCK_DOCTOR_QUEUE = [
  { id: 'q-1', patientName: 'Alex Mercer', recordName: 'Chest X-Ray Imaging', type: 'Radiology', date: '2026-06-02', fileUrl: '#' },
  { id: 'q-2', patientName: 'Sarah Jenkins', recordName: 'Urinalysis Report', type: 'Lab Result', date: '2026-06-22', fileUrl: '#' },
  { id: 'q-3', patientName: 'Marcus Aurelius', recordName: 'Electrocardiogram (ECG)', type: 'Cardiology', date: '2026-06-24', fileUrl: '#' }
];

const MOCK_APPOINTMENTS = [
  { id: 'apt-1', name: 'Alex Mercer', type: 'Heart Checkup', time: '09:30 AM', date: 'Today', status: 'confirmed' },
  { id: 'apt-2', name: 'Robert Chase', type: 'License Consultation', time: '11:00 AM', date: 'Today', status: 'pending' },
  { id: 'apt-3', name: 'James Wilson', type: 'Oncology Review', time: '02:15 PM', date: 'Tomorrow', status: 'confirmed' }
];

export default function DashboardShell() {
  // Navigation states to switch roles and inspect the exact file paths
  const [currentRole, setCurrentRole] = useState<'patient' | 'doctor'>('patient');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Interactive Sandbox states
  const [patientRecords, setPatientRecords] = useState(MOCK_PATIENT_RECORDS);
  const [doctorQueue, setDoctorQueue] = useState(MOCK_DOCTOR_QUEUE);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [doctorStatus, setDoctorStatus] = useState<'active' | 'busy' | 'away' | 'dnd'>('active');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Form states for adding a patient record (Simulates Module 4)
  const [newRecordName, setNewRecordName] = useState('');
  const [newRecordType, setNewRecordType] = useState('Lab Result');

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRecordUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordName.trim()) return;

    const newRec = {
      id: `rec-${Date.now()}`,
      name: newRecordName,
      type: newRecordType,
      date: new Date().toISOString().split('T')[0],
      doctor: 'Dr. Gregory House',
      status: 'pending',
      url: '#'
    };

    setPatientRecords([newRec, ...patientRecords]);
    
    // Auto-populate Doctor Verification Queue for interactive cross-portal testing!
    const newQueueItem = {
      id: `q-${Date.now()}`,
      patientName: 'Alex Mercer',
      recordName: newRecordName,
      type: newRecordType,
      date: newRec.date,
      fileUrl: '#'
    };
    setDoctorQueue([newQueueItem, ...doctorQueue]);

    setNewRecordName('');
    setShowUploadModal(false);
    triggerToast("Document uploaded securely! Sent to Dr. House for review.", "success");
  };

  const handleReviewAction = (id: string, action: 'approve' | 'request_revision' | 'reject') => {
    const queueItem = doctorQueue.find(item => item.id === id);
    if (!queueItem) return;

    // Remove from Doctor Queue
    setDoctorQueue(doctorQueue.filter(item => item.id !== id));

    // Update state inside Patient Vault
    setPatientRecords(prev => prev.map(rec => {
      if (rec.name === queueItem.recordName) {
        return {
          ...rec,
          status: action === 'approve' ? 'approved' : action === 'request_revision' ? 'revision_requested' : 'rejected',
          feedback: action === 'request_revision' ? 'A detailed review was requested. Scan is incomplete.' : undefined
        };
      }
      return rec;
    }));

    const statusText = action === 'approve' ? 'Approved' : action === 'request_revision' ? 'Sent Back for Revision' : 'Rejected';
    triggerToast(`Record successfully updated to: ${statusText}`, action === 'approve' ? 'success' : 'info');
  };

  return (
    <div className={`min-h-screen w-full font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* DEVELOPER SANDBOX CONTROL HEADER */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 text-white text-xs px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Activity size={16} className="animate-pulse text-emerald-300" />
          <span className="font-extrabold tracking-wide uppercase">Sandbox Portal Selector:</span>
          <span className="opacity-80">Reroute views to simulate completely separate production directories</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex rounded-lg bg-black/20 p-1">
            <button
              onClick={() => setCurrentRole('patient')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${currentRole === 'patient' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              <User size={13} />
              Patient Portal (`/patient`)
            </button>
            <button
              onClick={() => setCurrentRole('doctor')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 ${currentRole === 'doctor' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'}`}
            >
              <Stethoscope size={13} />
              Doctor Portal (`/doctor`)
            </button>
          </div>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </div>

      {/* DUAL PORTAL LAYOUT SHELL */}
      <div className="flex min-h-[calc(100vh-48px)]">
        
        {/* SIDEBAR NAVIGATION - RENDERS ROLE-SPECIFIC ITEMS */}
        <aside className={`w-64 border-r p-5 flex flex-col justify-between transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="space-y-6">
            <div className="flex items-center gap-2.5 px-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${currentRole === 'doctor' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
                {currentRole === 'doctor' ? <Stethoscope size={18} /> : <HeartPulse size={18} />}
              </div>
              <div>
                <span className="font-extrabold text-md tracking-tight block">MedVault</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enterprise Vault v1.2</span>
              </div>
            </div>

            {/* Profile Panel Overview */}
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white relative ${currentRole === 'doctor' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                {currentRole === 'doctor' ? <Stethoscope size={20} /> : <User size={20} />}
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate">
                  {currentRole === 'doctor' ? 'Dr. Gregory House' : 'Alex Mercer'}
                </p>
                <span className={`text-[10px] font-bold uppercase ${currentRole === 'doctor' ? 'text-emerald-500' : 'text-blue-500'}`}>
                  {currentRole} Account
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 px-2 tracking-wider">Main Workspace</span>
              
              <button className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-all bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white`}>
                <span className="flex items-center gap-2">
                  <Activity size={15} />
                  Dashboard Overview
                </span>
                <ChevronRight size={12} />
              </button>

              {currentRole === 'patient' ? (
                <>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <FileText size={15} />
                    My Health Records (Vault)
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <Calendar size={15} />
                    Consultations & Booking
                  </button>
                </>
              ) : (
                <>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <FileText size={15} />
                    Verification Queue
                    {doctorQueue.length > 0 && (
                      <span className="ml-auto bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {doctorQueue.length}
                      </span>
                    )}
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <Calendar size={15} />
                    Appointment Schedule
                  </button>
                </>
              )}
            </nav>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => triggerToast("Session disconnected securely.", "info")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
            >
              <LogOut size={15} />
              Logout Session
            </button>
          </div>
        </aside>

        {/* WORKSPACE AREA - LOADS SPECIFIC DASHBOARD CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full">
          
          {/* TOAST NOTIFICATION CONTAINER */}
          {notification && (
            <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border animate-bounce text-xs font-bold ${
              notification.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 text-emerald-800 dark:text-emerald-200' 
                : notification.type === 'error'
                  ? 'bg-red-50 dark:bg-red-950 border-red-200 text-red-800 dark:text-red-200'
                  : 'bg-blue-50 dark:bg-blue-950 border-blue-200 text-blue-800 dark:text-blue-200'
            }`}>
              <CheckCircle size={14} />
              <span>{notification.message}</span>
            </div>
          )}

          {/* ========================================== */}
          {/* OPTION A: PATIENT DASHBOARD (app/patient/page.tsx) */}
          {/* ========================================== */}
          {currentRole === 'patient' && (
            <div className="space-y-6">
              
              {/* Dynamic Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Patient Health Workspace</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage secure document encryption, trace verified diagnostics, and coordinate consultations.
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-200 dark:shadow-none transition-all"
                >
                  <Upload size={14} />
                  Upload Medical Record
                </button>
              </div>

              {/* Stats Overview Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vault Records</p>
                  <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">{patientRecords.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">AES-256 Encrypted files</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified Records</p>
                  <p className="text-2xl font-black mt-1 text-emerald-500">
                    {patientRecords.filter(r => r.status === 'approved').length}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Audit-ready medical history</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verification Rate</p>
                  <p className="text-2xl font-black mt-1 text-blue-500">
                    {Math.round((patientRecords.filter(r => r.status === 'approved').length / patientRecords.length) * 100)}%
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Approved by clinical staff</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Checkups</p>
                  <p className="text-2xl font-black mt-1 text-purple-500">1</p>
                  <p className="text-[10px] text-slate-400 mt-1">Confirmed with Dr. House</p>
                </div>
              </div>

              {/* Medical Record Vault Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Patient Records Timeline (Module 4) */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <FileText size={15} className="text-blue-500" />
                      Medical Vault & Document Timeline
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {patientRecords.map((rec) => (
                      <div 
                        key={rec.id} 
                        className={`p-4 rounded-xl border transition-all ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-850 hover:border-slate-800' : 'bg-white border-slate-200/60 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-xs font-black">{rec.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                theme === 'dark' ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {rec.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                              <span className="flex items-center gap-1"><Calendar size={11} /> {rec.date}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Stethoscope size={11} /> {rec.doctor}</span>
                            </div>
                          </div>

                          {/* Status pill badge */}
                          <div className="flex items-center gap-2">
                            {rec.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                <CheckCircle2 size={10} /> Verified
                              </span>
                            )}
                            {rec.status === 'pending' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Clock size={10} /> Pending Audit
                              </span>
                            )}
                            {rec.status === 'revision_requested' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                <XCircle size={10} /> Revision Sent
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actionable Feedback Drawer for records needing attention */}
                        {rec.status === 'revision_requested' && rec.feedback && (
                          <div className="mt-3 p-3 rounded-lg bg-rose-500/5 border border-rose-500/10 text-[10px] text-rose-500 flex items-start gap-2">
                            <Info size={12} className="mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="font-extrabold">Practitioner Feedback: </span>
                              {rec.feedback}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Widgets - Quick Actions & Emergency Panel */}
                <div className="space-y-6">
                  
                  {/* Immediate Emergency Health Card (Module 2) */}
                  <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-rose-500 mb-4 flex items-center gap-1.5">
                      <Phone size={14} />
                      Emergency Biological Profile
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Blood Group</span>
                          <span className="font-black text-rose-500 mt-0.5 block text-sm">O-Negative</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border dark:border-slate-850">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Allergies</span>
                          <span className="font-black text-slate-900 dark:text-white mt-0.5 block truncate">Penicillin</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-dashed dark:border-slate-800 space-y-1.5">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Assigned Emergency Contact</p>
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white">Sarah Mercer</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Phone size={10} /> +1 (555) 987-6543
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consultation / Appointment Quick Widget */}
                  <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-500 mb-4 flex items-center gap-1.5">
                      <Calendar size={14} />
                      Next Consultation Appointment
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        GH
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-black">Dr. Gregory House</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Cardiology Specialty • St. Jude West Wing</p>
                        <p className="text-[9px] text-indigo-500 font-bold mt-1">Today at 09:30 AM (Confirmed)</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* UPLOAD DRAWER MODAL MOCK (MODULE 4) */}
              {showUploadModal && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-800'
                  }`}>
                    <div className="flex items-center justify-between mb-4 border-b pb-3 dark:border-slate-850">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                        <Upload size={16} className="text-blue-500" />
                        Secure Vault Upload
                      </h3>
                      <button 
                        onClick={() => setShowUploadModal(false)}
                        className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-400 hover:text-slate-500"
                      >
                        <span className="text-lg font-bold">×</span>
                      </button>
                    </div>

                    <form onSubmit={handleRecordUpload} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Document Record Name</label>
                        <input 
                          type="text" 
                          required
                          value={newRecordName}
                          onChange={(e) => setNewRecordName(e.target.value)}
                          className="block w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white" 
                          placeholder="e.g. CBC Blood Work PDF"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Record Categorization</label>
                        <select 
                          value={newRecordType}
                          onChange={(e) => setNewRecordType(e.target.value)}
                          className="block w-full px-3 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                        >
                          <option value="Lab Result">Lab Result</option>
                          <option value="Radiology">Radiology (X-Ray / MRI)</option>
                          <option value="Immunization">Immunization Record</option>
                          <option value="Prescription">Prescription Slip</option>
                        </select>
                      </div>

                      <div className="p-3 bg-blue-500/5 rounded-xl border border-dashed border-blue-500/20 text-[10px] text-slate-400 leading-relaxed">
                        Security Notice: Upon submission, files are cryptographically registered. Your selected medical advisor will review the document details to update your immutable timeline.
                      </div>

                      <button 
                        type="submit"
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                      >
                        Upload and Route to Doctor
                      </button>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ========================================== */}
          {/* OPTION B: DOCTOR PORTAL (app/doctor/page.tsx) */}
          {/* ========================================== */}
          {currentRole === 'doctor' && (
            <div className="space-y-6">
              
              {/* Dynamic Welcome Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 dark:border-slate-800">
                <div>
                  <h1 className="text-2xl font-black tracking-tight">Clinical Verification Hub</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Practitioner Workspace: Audit patient-submitted diagnostic records and manage scheduled appointments.
                  </p>
                </div>

                {/* Doctor Availability status control (Module 3 settings integration) */}
                <div className="flex items-center gap-1.5 p-1 rounded-xl border dark:border-slate-800">
                  {(['active', 'busy', 'away', 'dnd'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => { setDoctorStatus(s); triggerToast(`Availability status switched to: ${s.toUpperCase()}`, 'info'); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        doctorStatus === s 
                          ? 'bg-emerald-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats Panel */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Approvals</p>
                  <p className="text-2xl font-black mt-1 text-amber-500">{doctorQueue.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Files requiring clinical audits</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scheduled Consultations</p>
                  <p className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
                    {appointments.filter(a => a.status === 'confirmed').length}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">Confirmed slots booked today</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Patient List</p>
                  <p className="text-2xl font-black mt-1 text-blue-500">28</p>
                  <p className="text-[10px] text-slate-400 mt-1">Patients tracked in clinic database</p>
                </div>
                <div className={`p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Specialty</p>
                  <p className="text-sm font-black mt-2 text-emerald-500 uppercase tracking-wide">Cardiology Desk</p>
                  <p className="text-[10px] text-slate-400 mt-1">License Verified: MD-982103</p>
                </div>
              </div>

              {/* Central Section - Patient verification & Calendar Schedule */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Module 5 - Verification Queue Widget */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award size={15} className="text-emerald-500" />
                    Patient Document Verification Queue (Module 5)
                  </h2>

                  {doctorQueue.length === 0 ? (
                    <div className={`p-8 text-center rounded-2xl border border-dashed ${
                      theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-3" />
                      <h4 className="text-xs font-black">All clear! Queue is empty.</h4>
                      <p className="text-[10px] text-slate-400 mt-1">No pending uploads require audit reviews at this time.</p>
                      <button 
                        onClick={() => {
                          // Seed mock queue items back for demonstration
                          setDoctorQueue(MOCK_DOCTOR_QUEUE);
                          triggerToast("Sandbox queue data restored for testing.", "info");
                        }} 
                        className="mt-3 text-[10px] font-bold text-emerald-600 hover:underline"
                      >
                        Click to restore queue items
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {doctorQueue.map((item) => (
                        <div 
                          key={item.id} 
                          className={`p-4 rounded-xl border transition-all ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="text-xs font-black">{item.recordName}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                                  theme === 'dark' ? 'bg-slate-950 text-slate-300' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {item.type}
                                </span>
                              </div>
                              <p className="text-[10px] font-semibold text-slate-400">
                                Patient Name: <span className="text-slate-900 dark:text-white font-bold">{item.patientName}</span>
                              </p>
                              <p className="text-[9px] text-slate-400 flex items-center gap-1">
                                <Clock size={10} /> Submitted on: {item.date}
                              </p>
                            </div>

                            {/* Verification Decisions */}
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleReviewAction(item.id, 'approve')}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm shadow-emerald-100 dark:shadow-none"
                              >
                                <CheckCircle size={12} /> Approve
                              </button>
                              <button 
                                onClick={() => handleReviewAction(item.id, 'request_revision')}
                                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-500 font-bold text-[10px] flex items-center gap-1"
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

                {/* Right Side Widgets - Scheduling Desk */}
                <div className="space-y-6">
                  
                  {/* Today's appointments List */}
                  <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-500 mb-4 flex items-center gap-1.5">
                      <Calendar size={14} />
                      Today's Consultation List
                    </h3>

                    <div className="space-y-3">
                      {appointments.map((apt) => (
                        <div key={apt.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850">
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-black truncate">{apt.name}</h4>
                            <p className="text-[9px] text-slate-400">{apt.type} • {apt.time}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${
                            apt.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consultation Charge details widget */}
                  <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200/60 shadow-sm'}`}>
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
          )}

        </main>
      </div>
    </div>
  );
}