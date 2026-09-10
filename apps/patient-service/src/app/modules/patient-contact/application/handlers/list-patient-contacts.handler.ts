import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_CONTACT_REPOSITORY } from '../../patient-contact.tokens';
import { PatientContactMapper } from '../../infrastructure/persistence/patient-contact.mapper';
import { PatientContactReadModel } from '../dto/patient-contact-read-model';
import { PatientContactRepository } from '../ports/patient-contact.repository';
import { ListPatientContactsQuery } from '../queries/list-patient-contacts.query';

@QueryHandler(ListPatientContactsQuery)
export class ListPatientContactsHandler
  implements IQueryHandler<ListPatientContactsQuery, PatientContactReadModel[]>
{
  constructor(
    @Inject(PATIENT_CONTACT_REPOSITORY)
    private readonly contacts: PatientContactRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    query: ListPatientContactsQuery,
  ): Promise<PatientContactReadModel[]> {
    const exists = await this.patients.existsById(query.patientId);
    if (!exists) throw new NotFoundException('Patient not found');
    return (await this.contacts.findByPatientId(query.patientId)).map(
      PatientContactMapper.toReadModel,
    );
  }
}
