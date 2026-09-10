import { PatientEmergencyContactAggregate } from '../../domain/patient-emergency-contact.aggregate';

export interface PatientEmergencyContactRepository {
  save(
    contact: PatientEmergencyContactAggregate,
  ): Promise<PatientEmergencyContactAggregate>;
  findById(id: string): Promise<PatientEmergencyContactAggregate | null>;
  findByPatientId(
    patientId: string,
  ): Promise<PatientEmergencyContactAggregate[]>;
  unsetPrimary(patientId: string, excludeId?: string): Promise<void>;
  delete(id: string): Promise<void>;
}
