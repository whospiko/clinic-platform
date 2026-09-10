import { DoctorGender } from '../../domain/doctor-gender.enum';
import { DoctorStatus } from '../../domain/doctor-status.enum';

export interface DoctorReadModel {
  id: string;
  userId: string | null;
  employeeCode: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: DoctorGender;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  yearsExperience: number;
  status: DoctorStatus;
  createdAt: string;
  updatedAt: string;
}
