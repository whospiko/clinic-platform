import { PatientSummaryReadModel } from '../dto/patient-read-model';

export interface PatientReaderPort {
  existsById(id: string): Promise<boolean>;
  findSummaryById(id: string): Promise<PatientSummaryReadModel | null>;
  findSummariesByIds(ids: string[]): Promise<PatientSummaryReadModel[]>;
}
