import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_ADDRESS_REPOSITORY } from '../../patient-address.tokens';
import { PatientAddressMapper } from '../../infrastructure/persistence/patient-address.mapper';
import { PatientAddressReadModel } from '../dto/patient-address-read-model';
import { PatientAddressRepository } from '../ports/patient-address.repository';
import { ListPatientAddressesQuery } from '../queries/list-patient-addresses.query';

@QueryHandler(ListPatientAddressesQuery)
export class ListPatientAddressesHandler
  implements IQueryHandler<ListPatientAddressesQuery, PatientAddressReadModel[]>
{
  constructor(
    @Inject(PATIENT_ADDRESS_REPOSITORY)
    private readonly addresses: PatientAddressRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    query: ListPatientAddressesQuery,
  ): Promise<PatientAddressReadModel[]> {
    if (!(await this.patients.existsById(query.patientId)))
      throw new NotFoundException('Patient not found');
    return (await this.addresses.findByPatientId(query.patientId)).map(
      PatientAddressMapper.toReadModel,
    );
  }
}
