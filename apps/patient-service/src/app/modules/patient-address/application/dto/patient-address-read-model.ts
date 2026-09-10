import { PatientAddressType } from '../../domain/patient-address-type.enum';

export interface PatientAddressReadModel {
  id: string;
  patientId: string;
  type: PatientAddressType;
  line1: string;
  line2: string | null;
  commune: string | null;
  district: string | null;
  province: string | null;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}
