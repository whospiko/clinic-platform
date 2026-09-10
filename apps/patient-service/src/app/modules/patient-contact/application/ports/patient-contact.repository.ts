import { PatientContactAggregate } from '../../domain/patient-contact.aggregate';

export interface PatientContactRepository {
  save(contact: PatientContactAggregate): Promise<PatientContactAggregate>;
  findById(id: string): Promise<PatientContactAggregate | null>;
  findByPatientId(patientId: string): Promise<PatientContactAggregate[]>;
  unsetPrimary(patientId: string, excludeId?: string): Promise<void>;
  delete(id: string): Promise<void>;
}
