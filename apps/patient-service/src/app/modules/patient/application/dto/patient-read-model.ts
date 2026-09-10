import { Gender } from '../../domain/gender.enum';
import { PatientStatus } from '../../domain/patient-status.enum';

export interface PatientReadModel {
  id: string;
  code: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  nationalId: string | null;
  status: PatientStatus;
  remark: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PatientSummaryReadModel {
  id: string;
  code: string;
  fullName: string;
  phone: string | null;
  email: string | null;
  status: PatientStatus;
}
