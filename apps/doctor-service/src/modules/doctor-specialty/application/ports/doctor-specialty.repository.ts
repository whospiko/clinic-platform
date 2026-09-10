import { DoctorSpecialtyEntity } from '../../domain/doctor-specialty.entity';
export abstract class DoctorSpecialtyRepository {
  abstract save(value: DoctorSpecialtyEntity): Promise<void>;
  abstract findPair(
    doctorId: string,
    specialtyId: string,
  ): Promise<DoctorSpecialtyEntity | null>;
  abstract findByDoctor(doctorId: string): Promise<DoctorSpecialtyEntity[]>;
  abstract clearPrimary(doctorId: string): Promise<void>;
  abstract delete(doctorId: string, specialtyId: string): Promise<void>;
}
