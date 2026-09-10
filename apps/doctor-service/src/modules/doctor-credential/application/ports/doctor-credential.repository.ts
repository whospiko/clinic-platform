import { DoctorCredentialAggregate } from '../../domain/doctor-credential.aggregate';
export abstract class DoctorCredentialRepository {
  abstract save(v: DoctorCredentialAggregate): Promise<void>;
  abstract findById(id: string): Promise<DoctorCredentialAggregate | null>;
  abstract findByDoctor(doctorId: string): Promise<DoctorCredentialAggregate[]>;
  abstract findDuplicate(
    doctorId: string,
    credentialNumber: string,
  ): Promise<DoctorCredentialAggregate | null>;
  abstract delete(id: string): Promise<void>;
}
