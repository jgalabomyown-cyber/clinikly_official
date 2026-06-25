"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FolderOpen,
  ArrowUpDown,
  Plus,
  Trash2,
  FileUp,
  Download,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { mockMedicalRecords, MockMedicalRecord } from '../../../data/mockData';

// ============================================================================
// PRODUCTION INSTRUCTIONS (Uncomment these when copying to your local project):
// ============================================================================
// import { createClient } from '@/lib/supabase/client';

export default function PatientRecordsPage() {
  /* STREAMING_CHUNK: Defining state managers for records, filters, search queries, and uploader interactions */
  const [records, setRecords] = useState<MockMedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc'>('date_desc');
  
  // Interactive Upload Modal & State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState<string>('LAB_RESULT');
  const [assignDoctor, setAssignDoctor] = useState<string>('doc-001'); // Defaulting to Dr. Jenkins
  const [isUploading, setIsUploading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  /* STREAMING_CHUNK: Simulating secure database queries from medical_records table on page load */
  useEffect(() => {
    async function loadRecords() {
      setIsLoading(true);
      try {
        // PRODUCTION WORKFLOW:
        // const supabase = createClient();
        // const { data: { user } } = await supabase.auth.getUser();
        // const { data } = await supabase.from('medical_records').select('*').eq('patient_id', user.id);
        // setRecords(data);

        // Fallback to our structured seed dataset
        setRecords(mockMedicalRecords as MockMedicalRecord[]);
      } catch (err) {
        console.error("Failed to query medical vault:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRecords();
  }, []);

  const triggerNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  /* STREAMING_CHUNK: Handling simulated Drag and Drop file selection triggers */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        triggerNotification("Invalid file type. Please upload a PDF or Image record.", "error");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  /* STREAMING_CHUNK: Implementing the cryptographic verification upload database write */
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      triggerNotification("Please select a diagnostic file to upload first.", "error");
      return;
    }

    setIsUploading(true);
    try {
      // Mimic S3 upload and secure relational insert delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newRecord: MockMedicalRecord = {
        id: `rec-${Date.now()}`,
        patient_id: 'pat-001',
        record_type: uploadCategory as any,
        file_url: `https://medvault-storage.s3.amazonaws.com/records/${selectedFile.name.replace(/\s+/g, '_')}`,
        upload_date: new Date().toISOString(),
        status: 'PENDING',
        assigned_doctor_id: assignDoctor,
        users: {
          first_name: 'Sarah',
          last_name: 'Jenkins'
        }
      };

      // Append local state
      setRecords(prev => [newRecord, ...prev]);
      setIsUploadOpen(false);
      setSelectedFile(null);
      triggerNotification(`"${selectedFile.name}" successfully routed to clinical review queue!`, "success");
    } catch (err) {
      triggerNotification("Failed to finalize encrypted record upload.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  /* STREAMING_CHUNK: Simulating client record removal securely from index keys */
  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    triggerNotification("Document record unlinked from active timeline.", "success");
  };

  /* STREAMING_CHUNK: Filtering and searching compiled local records datasets */
  const filteredRecords = records
    .filter(rec => {
      const matchesSearch = rec.file_url.split('/').pop()?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rec.record_type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'ALL' || rec.record_type === selectedType;
      const matchesStatus = selectedStatus === 'ALL' || rec.status === selectedStatus;
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.upload_date).getTime();
      const dateB = new Date(b.upload_date).getTime();
      return sortBy === 'date_desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      
      {/* Dynamic Toast Alerts */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl border text-xs font-bold transition-all animate-bounce ${
          notification.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200' 
            : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-900 text-red-800 dark:text-red-200'
        }`}>
          <AlertCircle size={15} />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 border-slate-200 dark:border-slate-850">
        <div>
          <h1 className="text-2xl font-black tracking-tight dark:text-white">Secure Medical Vault</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Store, categorize, and track your clinical records. Approved documents remain encrypted and immutable on your timeline.
          </p>
        </div>
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-200 dark:shadow-none transition-all active:scale-95"
        >
          <Plus size={14} />
          Add New Record
        </button>
      </div>

      {/* FILTER CONSOLE PANEL */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input 
            type="text" 
            placeholder="Search records by filename or category..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category select */}
        <div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="block w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="LAB_RESULT">Lab Results</option>
            <option value="PRESCRIPTION">Prescriptions</option>
            <option value="XRAY">X-Rays & Imaging</option>
            <option value="VACCINATION">Vaccinations</option>
            <option value="DIAGNOSTIC">Diagnostics</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="block w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="APPROVED">Verified</option>
            <option value="PENDING">Pending Audit</option>
            <option value="REVISION_REQUESTED">Needs Revision</option>
          </select>

          {/* Sort trigger button */}
          <button
            onClick={() => setSortBy(sortBy === 'date_desc' ? 'date_asc' : 'date_desc')}
            className="p-2 border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white"
            title="Sort Date order"
          >
            <ArrowUpDown size={15} />
          </button>
        </div>
      </div>

      {/* STREAMING_CHUNK: Rendering the detailed records grid and timeline list view */}
      {/* RECORD TIMELINE CONTENT SECTION */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-sm font-semibold text-slate-400 animate-pulse">Decrypting safe vault files...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <FolderOpen size={48} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-sm font-black dark:text-white">No Matching Vault Records</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Try resetting your search query filters or upload a new file diagnostic sheet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRecords.map((rec) => {
            const fileName = rec.file_url.split('/').pop() || 'Medical_Record.pdf';
            const cleanName = fileName.replace(/_/g, ' ').replace(/\.pdf$/i, '');

            return (
              <div 
                key={rec.id}
                className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                {/* File Details Group */}
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                    <FileText size={20} />
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xs font-black truncate dark:text-white max-w-sm" title={cleanName}>
                        {cleanName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-300">
                        {rec.record_type.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(rec.upload_date).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        Assigned: {rec.users?.first_name ? `Dr. ${rec.users.first_name} ${rec.users.last_name || ''}` : 'Unassigned'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls and verification status tracker */}
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-800">
                  {/* Status Badges */}
                  <div>
                    {rec.status === 'APPROVED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 size={11} /> Verified Record
                      </span>
                    )}
                    {rec.status === 'PENDING' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <Clock size={11} /> Pending Audit
                      </span>
                    )}
                    {rec.status === 'REVISION_REQUESTED' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20" title="Feedback issued on this file.">
                        <AlertCircle size={11} /> Revision Requested
                      </span>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-1.5">
                    <a 
                      href={rec.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-850"
                      title="Download/Preview encrypted PDF"
                    >
                      <Download size={14} />
                    </a>
                    
                    {/* Can only unlink files that are pending or need revisions, keeping verified histories immutable */}
                    {rec.status !== 'APPROVED' ? (
                      <button 
                        onClick={() => handleDeleteRecord(rec.id)}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                        title="Delete record draft"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center text-slate-300 dark:text-slate-700" title="Verified elements cannot be deleted">
                        <CheckCircle2 size={14} className="opacity-40" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* STREAMING_CHUNK: Rendering the modular secure upload file modal screen overlay */}
      {/* MODAL SYSTEM OVERLAY: ADD RECORD */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl p-6 border shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-white">
            
            <div className="flex items-center justify-between border-b pb-3 border-slate-150 dark:border-slate-800">
              <h3 className="text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <FileUp size={16} className="text-blue-500" />
                Vault Cryptography Upload Drawer
              </h3>
              <button 
                onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-500"
              >
                <span className="text-xl font-bold">×</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 mt-4">
              
              {/* Drag and Drop Zone Area */}
              <div 
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : selectedFile 
                      ? 'border-emerald-500 bg-emerald-500/5' 
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <input 
                  type="file" 
                  id="file-upload-input"
                  onChange={handleFileChange}
                  accept=".pdf,image/*"
                  className="hidden" 
                />

                <label htmlFor="file-upload-input" className="cursor-pointer block space-y-2">
                  <div className="mx-auto w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UploadCloud size={24} />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-black text-emerald-500">File Selected Successfully!</p>
                      <p className="text-[10px] text-slate-400 mt-1 truncate max-w-sm mx-auto">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Drag & drop your medical PDF sheet or browse</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">Supports high-res scanned lab panels or prescription images</p>
                    </div>
                  )}
                </label>
              </div>

              {/* Form Input Groupings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Categorization</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white"
                  >
                    <option value="LAB_RESULT">Laboratory Result</option>
                    <option value="PRESCRIPTION">Prescription Slip</option>
                    <option value="XRAY">Radiology X-Ray / CT</option>
                    <option value="VACCINATION">Vaccination Card</option>
                    <option value="DIAGNOSTIC">Other Diagnostic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Assign Reviewing Practitioner</label>
                  <select
                    value={assignDoctor}
                    onChange={(e) => setAssignDoctor(e.target.value)}
                    className="block w-full px-3 py-2 text-xs border rounded-xl bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-900 dark:text-white"
                  >
                    <option value="doc-001">Dr. Sarah Jenkins (Cardiology)</option>
                    <option value="doc-002">Dr. Marcus Vance (General Medicine)</option>
                  </select>
                </div>
              </div>

              {/* Safety notice disclaimer */}
              <div className="p-3 bg-blue-500/5 rounded-xl border border-dashed border-blue-500/10 text-[9px] text-slate-500 leading-relaxed flex items-start gap-1.5">
                <Info size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Compliance Directive:</strong> Uploading items automatically logs a pending status audit payload. Assigned clinical specialists review details against cryptographic logs before locking history.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsUploadOpen(false); setSelectedFile(null); }}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-1/2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  {isUploading ? (
                    <>Completing Encryption...</>
                  ) : (
                    <>Submit to Doctor Queue</>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline component fallback for Icon styling representation
function UploadCloud(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}