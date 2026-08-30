export const DOCTOR_VALIDATOR = Symbol('DOCTOR_VALIDATOR');

export interface DoctorValidatorPort {
    ensureDoctorExists(doctorId: string): Promise<void>;
}