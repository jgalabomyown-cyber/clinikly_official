/**
 * Mock Database Seed Data
 * Mirrors the relational structure of your Supabase database.
 * Use these datasets for frontend prototyping and sandbox states.
 */

export interface MockUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'patient' | 'doctor' | 'staff' | 'admin';
  created_at: string;
}

export interface MockPatientProfile {
  id: string;
  birthdate: string;
  contact_number: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  blood_type: string;
  allergies: string;
  users?: Partial<MockUser>;
}

export interface MockDoctorProfile {
  id: string;
  license_number: string;
  specialty: string;
  clinic_info: string;
  consultation_fee: number;
  is_verified: boolean;
  status: 'ACTIVE' | 'BUSY' | 'AWAY' | 'BREAK' | 'LUNCH' | 'DAY_OFF';
  users?: Partial<MockUser>;
}

export interface MockMedicalRecord {
  id: string;
  patient_id: string;
  record_type: 'LAB_RESULT' | 'PRESCRIPTION' | 'XRAY' | 'VACCINATION' | 'DIAGNOSTIC';
  file_url: string;
  upload_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUESTED';
  assigned_doctor_id: string | null;
  users?: Partial<MockUser>; // Linked patient info
}

export interface MockAppointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'MISSED';
  notes: string;
  users?: Partial<MockUser>; // Linked patient info
}

// ============================================================================
// CORE SEED DATA
// ============================================================================

export const mockUsers: MockUser[] = [
  {
    id: 'doc-001',
    email: 'dr.sarah.jenkins@medvault.com',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    role: 'doctor',
    created_at: '2026-01-15T08:30:00Z'
  },
  {
    id: 'doc-002',
    email: 'dr.marcus.vance@medvault.com',
    first_name: 'Marcus',
    last_name: 'Vance',
    role: 'doctor',
    created_at: '2026-02-10T09:15:00Z'
  },
  {
    id: 'pat-001',
    email: 'john.doe@gmail.com',
    first_name: 'John',
    last_name: 'Doe',
    role: 'patient',
    created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pat-002',
    email: 'emily.smith@yahoo.com',
    first_name: 'Emily',
    last_name: 'Smith',
    role: 'patient',
    created_at: '2026-03-05T14:20:00Z'
  },
  {
    id: 'pat-003',
    email: 'robert.chen@outlook.com',
    first_name: 'Robert',
    last_name: 'Chen',
    role: 'patient',
    created_at: '2026-04-12T11:05:00Z'
  }
];

export const mockDoctorProfiles: MockDoctorProfile[] = [
  {
    id: 'doc-001',
    license_number: 'MD-948204',
    specialty: 'Cardiology',
    clinic_info: 'St. Jude Heart Center, Rm 402',
    consultation_fee: 150.00,
    is_verified: true,
    status: 'ACTIVE',
    users: {
      first_name: 'Sarah',
      last_name: 'Jenkins',
      email: 'dr.sarah.jenkins@medvault.com'
    }
  },
  {
    id: 'doc-002',
    license_number: 'MD-105938',
    specialty: 'General Medicine',
    clinic_info: 'City Health Plaza, Suite B',
    consultation_fee: 75.00,
    is_verified: false, // Testing unverified signup approval flows
    status: 'DAY_OFF',
    users: {
      first_name: 'Marcus',
      last_name: 'Vance',
      email: 'dr.marcus.vance@medvault.com'
    }
  }
];

export const mockPatientProfiles: MockPatientProfile[] = [
  {
    id: 'pat-001',
    birthdate: '1988-11-23',
    contact_number: '+1 (555) 234-5678',
    emergency_contact_name: 'Jane Doe',
    emergency_contact_phone: '+1 (555) 987-6543',
    blood_type: 'O-Positive',
    allergies: 'Penicillin, Shellfish',
    users: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@gmail.com'
    }
  },
  {
    id: 'pat-002',
    birthdate: '1995-04-12',
    contact_number: '+1 (555) 345-6789',
    emergency_contact_name: 'Arthur Smith',
    emergency_contact_phone: '+1 (555) 876-5432',
    blood_type: 'A-Negative',
    allergies: 'Peanuts',
    users: {
      first_name: 'Emily',
      last_name: 'Smith',
      email: 'emily.smith@yahoo.com'
    }
  },
  {
    id: 'pat-003',
    birthdate: '2000-09-05',
    contact_number: '+1 (555) 567-8901',
    emergency_contact_name: 'Lisa Chen',
    emergency_contact_phone: '+1 (555) 678-9012',
    blood_type: 'B-Positive',
    allergies: 'Sulfa Drugs, Latex',
    users: {
      first_name: 'Robert',
      last_name: 'Chen',
      email: 'robert.chen@outlook.com'
    }
  }
];

export const mockMedicalRecords: MockMedicalRecord[] = [
  {
    id: 'rec-001',
    patient_id: 'pat-001',
    record_type: 'LAB_RESULT',
    file_url: 'https://medvault-storage.s3.amazonaws.com/records/blood_panel_march_2026.pdf',
    upload_date: '2026-06-20T10:30:00Z',
    status: 'PENDING',
    assigned_doctor_id: 'doc-001',
    users: {
      first_name: 'John',
      last_name: 'Doe'
    }
  },
  {
    id: 'rec-002',
    patient_id: 'pat-002',
    record_type: 'XRAY',
    file_url: 'https://medvault-storage.s3.amazonaws.com/records/chest_xray_lung_scan.pdf',
    upload_date: '2026-06-21T14:15:00Z',
    status: 'PENDING',
    assigned_doctor_id: 'doc-001',
    users: {
      first_name: 'Emily',
      last_name: 'Smith'
    }
  },
  {
    id: 'rec-003',
    patient_id: 'pat-001',
    record_type: 'PRESCRIPTION',
    file_url: 'https://medvault-storage.s3.amazonaws.com/records/lisinopril_prescription.pdf',
    upload_date: '2026-05-10T09:00:00Z',
    status: 'APPROVED',
    assigned_doctor_id: 'doc-001',
    users: {
      first_name: 'John',
      last_name: 'Doe'
    }
  },
  {
    id: 'rec-004',
    patient_id: 'pat-003',
    record_type: 'DIAGNOSTIC',
    file_url: 'https://medvault-storage.s3.amazonaws.com/records/ecg_holter_monitor_report.pdf',
    upload_date: '2026-06-22T08:45:00Z',
    status: 'PENDING',
    assigned_doctor_id: 'doc-001',
    users: {
      first_name: 'Robert',
      last_name: 'Chen'
    }
  }
];

export const mockAppointments: MockAppointment[] = [
  {
    id: 'apt-001',
    patient_id: 'pat-001',
    doctor_id: 'doc-001',
    appointment_date: '2026-06-24',
    start_time: '09:00 AM',
    end_time: '09:30 AM',
    status: 'ACCEPTED',
    notes: 'Routine cardiovascular follow-up.',
    users: {
      first_name: 'John',
      last_name: 'Doe'
    }
  },
  {
    id: 'apt-002',
    patient_id: 'pat-002',
    doctor_id: 'doc-001',
    appointment_date: '2026-06-24',
    start_time: '11:15 AM',
    end_time: '12:00 PM',
    status: 'PENDING',
    notes: 'Initial checkup regarding minor breathing difficulties.',
    users: {
      first_name: 'Emily',
      last_name: 'Smith'
    }
  },
  {
    id: 'apt-003',
    patient_id: 'pat-003',
    doctor_id: 'doc-001',
    appointment_date: '2026-06-24',
    start_time: '02:30 PM',
    end_time: '03:00 PM',
    status: 'ACCEPTED',
    notes: 'Reviewing recent lab panel details.',
    users: {
      first_name: 'Robert',
      last_name: 'Chen'
    }
  }
];