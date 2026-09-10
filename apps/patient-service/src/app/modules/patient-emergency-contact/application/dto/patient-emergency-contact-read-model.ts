export interface PatientEmergencyContactReadModel {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string | null;
  address: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
