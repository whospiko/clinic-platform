import { PatientAggregate } from '../../domain/patient.aggregate';
import { PatientStatus } from '../../domain/patient-status.enum';
import { Gender } from '../../domain/gender.enum';
import { PatientSummaryReadModel } from '../dto/patient-read-model';
import { Paginated } from '../../../../shared/pagination/paginated';

export interface PatientSearchCriteria {
  page: number;
  limit: number;
  q?: string;
  code?: string;
  phone?: string;
  email?: string;
  gender?: Gender;
  status?: PatientStatus;
}

export interface PatientRepository {
  save(patient: PatientAggregate): Promise<PatientAggregate>;
  findById(id: string): Promise<PatientAggregate | null>;
  findByCode(code: string): Promise<PatientAggregate | null>;
  findMany(
    criteria: PatientSearchCriteria,
  ): Promise<Paginated<PatientAggregate>>;
  existsById(id: string): Promise<boolean>;
  findSummaryById(id: string): Promise<PatientSummaryReadModel | null>;
  findSummariesByIds(ids: string[]): Promise<PatientSummaryReadModel[]>;
}
