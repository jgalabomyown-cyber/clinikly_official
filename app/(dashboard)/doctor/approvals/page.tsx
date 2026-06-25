"use client";

import React, { useState, useEffect } from 'react';
import { 
  Award, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink, 
  Eye, 
  Download, 
  Search, 
  Filter, 
  Calendar, 
  History, 
  Send, 
  Check, 
  RotateCcw, 
  FileCheck,
  User,
  Activity,
  ChevronRight,
  ClipboardList,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  notes: string;
  timestamp: string;
}

interface SelectedRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_birthdate: string;
  patient_blood: string;
  patient_allergies: string;
  record_type: 'LAB_RESULT' | 'PRESCRIPTION' | 'XRAY' | 'VACCINATION' | 'DIAGNOSTIC';
  file_url: string;
  file_name: string;
  upload_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  diagnostic_details?: {
    test_name: string;
    metrics: { name: string; value: string; range: string; status: 'normal' | 'high' | 'low' }[];
  };
}

// ============================================================================
// PRODUCTION ENFORCEMENT: (Uncomment these when copying to Next.js)
// ============================================================================
// import { createClient } from '@/lib/supabase/client';

export default function DoctorApprovalsPage() {
  /* STREAMING_CHUNK: Initializing state variables for filtering, selecting documents, and decision submissions */
  const [pendingRecords, setPendingRecords] = useState<SelectedRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<SelectedRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  
  // Feedback Forms State
  const [decisionNotes, setDecisionNotes] = useState('');
  const [activeDecision, setActiveDecision] = useState<'APPROVE' | 'REVISION' | 'REJECT' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local Audit Logs Tracker
  const [auditLogs, setAuditLogs] = useState<Record<string, AuditLog[]>>({});
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  /* STREAMING_CHUNK: Loading interactive mock medical records and setting fallback state databases */
  useEffect(() => {
    async function loadVerificationQueue() {
      setIsLoading(true);
      try {
        // PRODUCTION WORKFLOW:
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();
        // const { data } = await supabase.from('medical_records').select('*, users:patient_id(...)').eq('assigned_doctor_id', user.id);
        
        // Comprehensive seed list matching relational schema payloads
        const seedData: SelectedRecord[] = [
          {
            id: 'rec-001',
            patient_id: 'pat-001',
            patient_name: 'John Doe',
            patient_birthdate: '1988-11-23',
            patient_blood: 'O-Positive',
            patient_allergies: 'Penicillin, Shellfish',
            record_type: 'LAB_RESULT',
            file_url: '#',
            file_name: 'blood_chemistry_march_2026.pdf',
            upload_date: '2026-06-20T10:30:00Z',
            status: 'PENDING',
            diagnostic_details: {
              test_name: 'Comprehensive Metabolic Panel (CMP)',
              metrics: [
                { name: 'Glucose', value: '112 mg/dL', range: '70 - 99 mg/dL', status: 'high' },
                { name: 'Creatinine', value: '0.92 mg/dL', range: '0.60 - 1.30 mg/dL', status: 'normal' },
                { name: 'BUN', value: '16 mg/dL', range: '7 - 20 mg/dL', status: 'normal' },
                { name: 'Potassium', value: '4.2 mmol/L', range: '3.5 - 5.1 mmol/L', status: 'normal' }
              ]
            }
          },
          {
            id: 'rec-002',
            patient_id: 'pat-002',
            patient_name: 'Emily Smith',
            patient_birthdate: '1995-04-12',
            patient_blood: 'A-Negative',
            patient_allergies: 'Peanuts',
            record_type: 'XRAY',
            file_url: '#',
            file_name: 'chest_xray_lung_scan.pdf',
            upload_date: '2026-06-21T14:15:00Z',
            status: 'PENDING'
          },
          {
            id: 'rec-003',
            patient_id: 'pat-003',
            patient_name: 'Robert Chen',
            patient_birthdate: '1976-08-05',
            patient_blood: 'B-Positive',
            patient_allergies: 'None Identified',
            record_type: 'VACCINATION',
            file_url: '#',
            file_name: 'covid19_booster_card.pdf',
            upload_date: '2026-06-24T09:00:00Z',
            status: 'PENDING'
          }
        ];

        setPendingRecords(seedData);
        if (seedData.length > 0) {
          setSelectedRecord(seedData[0]);
        }

        // Initialize mock historical audit trails
        const initialLogs: Record<string, AuditLog[]> = {
          'rec-001': [
            { id: 'log-1', action: 'RECORD_UPLOADED', actor: 'John Doe (Patient)', notes: 'Uploaded file blood_chemistry_march_2026.pdf via Patient Vault.', timestamp: '2026-06-20T10:30:00Z' },
            { id: 'log-2', action: 'ASSIGNED_TO_DOCTOR', actor: 'System Route', notes: 'Routed to Dr. Sarah Jenkins based on preferred Cardiology designation.', timestamp: '2026-06-20T10:31:12Z' }
          ],
          'rec-002': [
            { id: 'log-3', action: 'RECORD_UPLOADED', actor: 'Emily Smith (Patient)', notes: 'Uploaded file chest_xray_lung_scan.pdf via Mobile Capture.', timestamp: '2026-06-21T14:15:00Z' }
          ],
          'rec-003': [
            { id: 'log-4', action: 'RECORD_UPLOADED', actor: 'Robert Chen (Patient)', notes: 'Uploaded immunization validation transcript.', timestamp: '2026-06-24T09:00:00Z' }
          ]
        };
        setAuditLogs(initialLogs);

      } catch (err) {
        console.error("Failed to query verification database queues:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadVerificationQueue();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  /* STREAMING_CHUNK: Processing medical approvals and writing decisions back to standard database logs */
  const handleReviewDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord || !activeDecision) return;

    setIsSubmitting(true);
    try {
      // PRODUCTION DATABASE WRITE PREPARATION:
      // const supabase = createClient();
      // const targetStatus = activeDecision === 'APPROVE' ? 'APPROVED' : activeDecision === 'REVISION' ? 'REVISION_REQUESTED' : 'REJECTED';
      // await supabase.from('medical_records').update({ status: targetStatus }).eq('id', selectedRecord.id);
      // await supabase.from('record_audit_logs').insert({ record_id: selectedRecord.id, action: `STATUS_SET_TO_${targetStatus}`, notes: decisionNotes });

      await new Promise(resolve => setTimeout(resolve, 1200));

      const logAction = activeDecision === 'APPROVE' ? 'APPROVED' : activeDecision === 'REVISION' ? 'REVISION_REQUESTED' : 'REJECTED';
      
      // Update core list status representation
      setPendingRecords(prev => prev.map(rec => {
        if (rec.id === selectedRecord.id) {
          return { ...rec, status: logAction };
        }
        return rec;
      }));

      // Append detailed decisions into Audit logs trail
      const newLog: AuditLog = {
        id: `log-${Date.now()}`,
        action: `DECISION_COMMITTED_${logAction}`,
        actor: 'Dr. Sarah Jenkins',
        notes: decisionNotes.trim() || `Marked file as ${logAction.replace('_', ' ')} with no further notes.`,
        timestamp: new Date().toISOString()
      };

      setAuditLogs(prev => ({
        ...prev,
        [selectedRecord.id]: [...(prev[selectedRecord.id] || []), newLog]
      }));

      // Update selected record preview reference state
      setSelectedRecord(prev => prev ? { ...prev, status: logAction } : null);

      triggerToast(`Audit decision submitted! File updated to ${logAction.replace('_', ' ')}.`, 'success');
      setDecisionNotes('');
      setActiveDecision(null);

    } catch (err) {
      triggerToast("Failed to write verification action to database logs.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* STREAMING_CHUNK: Filtering results from search console inputs */
  const filteredQueue = pendingRecords.filter(item => {
    const matchesSearch = item.patient_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.file_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || item.record_type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast banners alerts */}
      {notification && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold transition-all animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200' 
            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
        }`}>
          <AlertCircle size={15} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Welcome Title */}
      <div className="border-b pb-5 border-slate-200 dark:border-slate-850">
        <h1 className="text-2xl font-black tracking-tight dark:text-white">Record Verification Desk</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Module 5: Audit patient uploads, run diagnostic comparisons, and maintain validated informational health registries.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-slate-400 animate-pulse">Retrieving pending clinical payloads...</p>
        </div>
      ) : (
        /* STREAMING_CHUNK: Constructing responsive dual column split grid layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT LIST COLUMN: AUDIT QUEUE SELECTOR (Col Span 5) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Search and Filter Panels */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                <ClipboardList size={12} /> Pending Audits Queue
              </span>
              
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Search size={14} />
                </span>
                <input 
                  type="text" 
                  placeholder="Filter by patient name, filename..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-8 pr-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white focus:ring-1 focus:ring-emerald-500"
              >
                <option value="ALL">All Diagnostic Categories</option>
                <option value="LAB_RESULT">Laboratory Results</option>
                <option value="PRESCRIPTION">Prescriptions</option>
                <option value="XRAY">Radiology & X-Ray</option>
                <option value="VACCINATION">Vaccination Records</option>
              </select>
            </div>

            {/* List Queue View */}
            {filteredQueue.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <ShieldCheck size={32} className="mx-auto text-emerald-500 mb-2" />
                <h4 className="text-xs font-black dark:text-white">Clinical Desk is Clean</h4>
                <p className="text-[10px] text-slate-400 mt-1">All incoming payloads successfully audited.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredQueue.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => { setSelectedRecord(item); setActiveDecision(null); setDecisionNotes(''); }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                      selectedRecord?.id === item.id
                        ? 'border-emerald-500 bg-emerald-500/5 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-black dark:text-white truncate max-w-[180px]">{item.patient_name}</h4>
                          <span className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400">
                            {item.record_type}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-mono truncate">{item.file_name}</p>
                        <p className="text-[8px] text-slate-400 flex items-center gap-1">
                          <Calendar size={10} /> Recieved: {new Date(item.upload_date).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Display Small Status Indicators */}
                      <div>
                        {item.status === 'PENDING' && (
                          <span className="h-2 w-2 rounded-full bg-amber-500 block" title="Pending evaluation" />
                        )}
                        {item.status === 'APPROVED' && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500 block" title="Approved" />
                        )}
                        {item.status === 'REVISION_REQUESTED' && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 block" title="Needs revision" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* STREAMING_CHUNK: Rendering the selected diagnostic document examination workspace pane */}
          {/* RIGHT COLUMN: DOCUMENT EXAMINATION WORKSPACE (Col Span 7) */}
          <div className="lg:col-span-7">
            {selectedRecord ? (
              <div className="space-y-6">
                
                {/* Examination Card Deck */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  
                  {/* Selected Record Header */}
                  <div className="flex justify-between items-start border-b pb-4 border-slate-150 dark:border-slate-800 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Auditing Target Workspace</span>
                      <h2 className="text-sm font-black dark:text-white flex items-center gap-1.5">
                        <FileText size={16} className="text-emerald-500" />
                        {selectedRecord.file_name}
                      </h2>
                      <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-950 text-slate-500 max-w-fit">
                        {selectedRecord.record_type}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Verification status</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mt-1 border ${
                        selectedRecord.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : selectedRecord.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {selectedRecord.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Biological Demographics Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 space-y-1">
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Patient Name</span>
                      <span className="text-xs font-black dark:text-white">{selectedRecord.patient_name}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 space-y-1">
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Biological Blood</span>
                      <span className="text-xs font-black text-rose-500">{selectedRecord.patient_blood}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border dark:border-slate-850 space-y-1">
                      <span className="text-[8px] font-bold uppercase text-slate-400 block">Allergy Warnings</span>
                      <span className="text-xs font-black dark:text-white truncate block" title={selectedRecord.patient_allergies}>
                        {selectedRecord.patient_allergies}
                      </span>
                    </div>
                  </div>

                  {/* STREAMING_CHUNK: Generating interactive simulated document preview window */}
                  {/* SIMULATED DOCUMENT PREVIEW FRAME */}
                  <div className="border rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850">
                    <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold">
                      <span className="flex items-center gap-1.5 text-slate-500"><Eye size={12} /> Secure File Document Preview</span>
                      <a 
                        href={selectedRecord.file_url} 
                        className="text-emerald-600 hover:underline flex items-center gap-1 text-[9px]"
                        onClick={(e) => { e.preventDefault(); triggerToast("Downloading original secure PDF sheet...", "info"); }}
                      >
                        <Download size={11} /> Download PDF
                      </a>
                    </div>
                    
                    {/* Preview Area container */}
                    <div className="p-6 text-slate-800 dark:text-slate-300 min-h-[160px] flex flex-col justify-between space-y-4">
                      {selectedRecord.diagnostic_details ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between border-b pb-2 border-slate-200 dark:border-slate-800">
                            <span className="text-xs font-black tracking-tight">{selectedRecord.diagnostic_details.test_name}</span>
                            <span className="text-[8px] font-mono text-slate-400">ID: {selectedRecord.id}</span>
                          </div>
                          <div className="space-y-2">
                            {selectedRecord.diagnostic_details.metrics.map((metric, idx) => (
                              <div key={idx} className="flex items-center justify-between text-[11px] font-medium border-b border-dashed border-slate-150 dark:border-slate-900 pb-1.5">
                                <span className="text-slate-400">{metric.name}</span>
                                <div className="flex items-center gap-3">
                                  <span className={`font-bold ${metric.status === 'high' ? 'text-rose-500' : 'text-slate-900 dark:text-slate-200'}`}>{metric.value}</span>
                                  <span className="text-[9px] text-slate-400 font-mono">Range: {metric.range}</span>
                                  <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase ${
                                    metric.status === 'high' 
                                      ? 'bg-rose-500/10 text-rose-500' 
                                      : 'bg-emerald-500/10 text-emerald-500'
                                  }`}>
                                    {metric.status}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-6 space-y-2">
                          <FileText size={32} className="mx-auto text-slate-300 dark:text-slate-700" />
                          <h4 className="text-xs font-bold dark:text-slate-400">Static Scanned Image (e.g. Chest X-Ray scan)</h4>
                          <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                            Preview contains custom diagnostic graphic details. Click download above to view the raw multi-page attachment file.
                          </p>
                        </div>
                      )}

                      <div className="text-[8px] font-bold uppercase text-slate-400 text-center border-t border-slate-200 dark:border-slate-900 pt-2 flex items-center justify-center gap-1">
                        <ShieldCheck size={10} className="text-emerald-500" /> AES-256 encrypted ledger preview
                      </div>
                    </div>
                  </div>

                  {/* STREAMING_CHUNK: Integrating the Action decisions form block */}
                  {/* INTERACTIVE ACTIONS DECISION DRAWER */}
                  {selectedRecord.status === 'PENDING' && (
                    <div className="border-t pt-5 border-slate-150 dark:border-slate-800 space-y-4">
                      
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Execute Verification Decision</span>
                        <p className="text-[9px] text-slate-400">Choose an action and submit your clinical findings to update the ledger.</p>
                      </div>

                      {/* Decisive Buttons Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => { setActiveDecision('APPROVE'); }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                            activeDecision === 'APPROVE'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <Check size={13} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveDecision('REVISION'); }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                            activeDecision === 'REVISION'
                              ? 'bg-amber-600 text-white border-amber-500 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-950 text-amber-600 dark:text-amber-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <RotateCcw size={13} /> Ask Revision
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveDecision('REJECT'); }}
                          className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                            activeDecision === 'REJECT'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-950 text-rose-600 dark:text-rose-400 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          <XCircle size={13} /> Reject File
                        </button>
                      </div>

                      {/* Decision Details Form */}
                      {activeDecision && (
                        <form onSubmit={handleReviewDecision} className="space-y-3 animate-in fade-in duration-200">
                          <div>
                            <label className="block text-[9px] font-bold uppercase text-slate-400 mb-1">
                              {activeDecision === 'APPROVE' 
                                ? 'Verification Signature Notes (Optional)' 
                                : 'Feedback / Reasons for requested changes (Required)'
                              }
                            </label>
                            <textarea
                              required={activeDecision !== 'APPROVE'}
                              rows={2}
                              value={decisionNotes}
                              onChange={(e) => setDecisionNotes(e.target.value)}
                              placeholder={
                                activeDecision === 'APPROVE'
                                  ? 'e.g. Verified CBC values align with historical cardiac profile checks.'
                                  : 'e.g. Scanned sheet page 2 is cut off. Please re-scan and include normal ranges.'
                              }
                              className="block w-full p-2.5 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-2 px-4 rounded-xl text-xs font-black text-white flex items-center justify-center gap-1.5 ${
                              activeDecision === 'APPROVE'
                                ? 'bg-emerald-600 hover:bg-emerald-700'
                                : activeDecision === 'REVISION'
                                  ? 'bg-amber-600 hover:bg-amber-700'
                                  : 'bg-rose-600 hover:bg-rose-700'
                            }`}
                          >
                            <Send size={12} />
                            {isSubmitting ? 'Recording Audit decision...' : 'Commit verification decision to timeline'}
                          </button>
                        </form>
                      )}

                    </div>
                  )}

                </div>

                {/* STREAMING_CHUNK: Mapping historical audit logs timeline details */}
                {/* SYSTEM INTEGRATION: IMMUTABLE AUDIT LOG TIMELINE (Module 5 audit tracking requirements) */}
                <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <History size={14} className="text-emerald-500" />
                    Record Audit Timeline History
                  </h3>

                  <div className="space-y-4">
                    {(auditLogs[selectedRecord.id] || []).map((log, idx) => (
                      <div key={log.id} className="flex gap-3 text-xs items-start">
                        {/* Bullet Marker Line */}
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black ${
                            log.action.startsWith('DECISION_COMMITTED_APPROVED')
                              ? 'bg-emerald-100 text-emerald-600'
                              : log.action.startsWith('DECISION_COMMITTED')
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-slate-100 text-slate-600'
                          }`}>
                            {idx + 1}
                          </div>
                          {idx !== (auditLogs[selectedRecord.id]?.length - 1) && (
                            <div className="w-0.5 h-10 bg-slate-100 dark:bg-slate-800 mt-1" />
                          )}
                        </div>

                        {/* Audit Log Content card */}
                        <div className="flex-1 space-y-1 overflow-hidden bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border dark:border-slate-850">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className="font-extrabold truncate uppercase text-[9px] tracking-wide text-slate-400">{log.action.replace(/_/g, ' ')}</span>
                            <span className="text-[8px] font-mono text-slate-400 flex items-center gap-1"><Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-slate-900 dark:text-slate-100 text-[11px] font-bold">Actor: {log.actor}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[10px] leading-relaxed">{log.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <FileCheck size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <h3 className="text-sm font-black dark:text-white font-black">No Diagnostic Document Selected</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Select a card in the left pending list to begin the interactive verification audit procedure.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}