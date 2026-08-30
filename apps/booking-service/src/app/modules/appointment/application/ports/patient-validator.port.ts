export const PATIENT_VALIDATOR = Symbol('PATIENT_VALIDATOR');

export interface PatientValidatorPort {
    ensurePatientExists(patientId: string): Promise<void>;
}