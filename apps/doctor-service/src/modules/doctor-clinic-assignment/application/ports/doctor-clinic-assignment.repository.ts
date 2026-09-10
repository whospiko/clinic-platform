import { DoctorClinicAssignmentAggregate } from '../../domain/doctor-clinic-assignment.aggregate';
export abstract class DoctorClinicAssignmentRepository {
  abstract save(v: DoctorClinicAssignmentAggregate): Promise<void>;
  abstract findById(
    id: string,
  ): Promise<DoctorClinicAssignmentAggregate | null>;
  abstract findActivePair(
    doctorId: string,
    clinicId: string,
  ): Promise<DoctorClinicAssignmentAggregate | null>;
  abstract findByDoctor(
    doctorId: string,
  ): Promise<DoctorClinicAssignmentAggregate[]>;
  abstract findByClinic(
    clinicId: string,
  ): Promise<DoctorClinicAssignmentAggregate[]>;
  abstract clearPrimary(doctorId: string): Promise<void>;
  abstract delete(id: string): Promise<void>;
}
