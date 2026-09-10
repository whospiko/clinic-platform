import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_REPOSITORY } from '../../patient.tokens';
import { PatientRepository } from '../ports/patient.repository';
import { PatientReadModel } from '../dto/patient-read-model';
import { PatientMapper } from '../../infrastructure/persistence/patient.mapper';
import { GetPatientQuery } from '../queries/get-patient.query';

@QueryHandler(GetPatientQuery)
export class GetPatientHandler
  implements IQueryHandler<GetPatientQuery, PatientReadModel>
{
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(query: GetPatientQuery): Promise<PatientReadModel> {
    const patient = await this.patients.findById(query.id);
    if (!patient) throw new NotFoundException('Patient not found');
    return PatientMapper.toReadModel(patient);
  }
}
