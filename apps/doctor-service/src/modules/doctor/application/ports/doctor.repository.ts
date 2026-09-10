import { DoctorAggregate } from '../../domain/doctor.aggregate';
import { DoctorStatus } from '../../domain/doctor-status.enum';
import { PageResult } from '../../../../shared-kernel/application/page-result';

export interface DoctorListFilter {
  page: number;
  limit: number;
  search?: string;
  status?: DoctorStatus;
  clinicId?: string;
  specialtyId?: string;
}

export abstract class DoctorRepository {
  abstract save(doctor: DoctorAggregate): Promise<void>;
  abstract findById(id: string): Promise<DoctorAggregate | null>;
  abstract findByEmployeeCode(
    employeeCode: string,
  ): Promise<DoctorAggregate | null>;
  abstract findMany(
    filter: DoctorListFilter,
  ): Promise<PageResult<DoctorAggregate>>;
  abstract delete(id: string): Promise<void>;
}
