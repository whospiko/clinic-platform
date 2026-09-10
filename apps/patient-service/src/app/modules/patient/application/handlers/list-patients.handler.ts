import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_REPOSITORY } from '../../patient.tokens';
import { PatientRepository } from '../ports/patient.repository';
import { PatientReadModel } from '../dto/patient-read-model';
import { PatientMapper } from '../../infrastructure/persistence/patient.mapper';
import { ListPatientsQuery } from '../queries/list-patients.query';
import {
  buildPaginated,
  Paginated,
} from '../../../../shared/pagination/paginated';

@QueryHandler(ListPatientsQuery)
export class ListPatientsHandler
  implements IQueryHandler<ListPatientsQuery, Paginated<PatientReadModel>>
{
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(
    query: ListPatientsQuery,
  ): Promise<Paginated<PatientReadModel>> {
    const result = await this.patients.findMany(query.params);
    return buildPaginated(
      result.data.map(PatientMapper.toReadModel),
      result.meta.page,
      result.meta.limit,
      result.meta.total,
    );
  }
}
