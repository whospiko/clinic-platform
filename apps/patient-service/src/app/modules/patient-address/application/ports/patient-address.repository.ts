import { PatientAddressAggregate } from '../../domain/patient-address.aggregate';

export interface PatientAddressRepository {
  save(address: PatientAddressAggregate): Promise<PatientAddressAggregate>;
  findById(id: string): Promise<PatientAddressAggregate | null>;
  findByPatientId(patientId: string): Promise<PatientAddressAggregate[]>;
  unsetPrimary(patientId: string, excludeId?: string): Promise<void>;
  delete(id: string): Promise<void>;
}
