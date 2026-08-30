export const TREATMENT_READER = Symbol('TREATMENT_READER');

export interface TreatmentInfo {
    id: string;
    name: string;
    durationMinutes: number;
}

export interface TreatmentReaderPort {
    getTreatment(treatmentId: string): Promise<TreatmentInfo | null>;
}