import { PatientContactType } from '../../domain/patient-contact-type.enum';

export interface PatientContactReadModel {
  id: string;
  patientId: string;
  type: PatientContactType;
  value: string;
  label: string | null;
  isPrimary: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
