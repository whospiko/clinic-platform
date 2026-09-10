import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from '../../patient-emergency-contact.tokens';
import { PatientEmergencyContactMapper } from '../../infrastructure/persistence/patient-emergency-contact.mapper';
import { PatientEmergencyContactReadModel } from '../dto/patient-emergency-contact-read-model';
import { PatientEmergencyContactRepository } from '../ports/patient-emergency-contact.repository';
import { ListPatientEmergencyContactsQuery } from '../queries/list-patient-emergency-contacts.query';

@QueryHandler(ListPatientEmergencyContactsQuery)
export class ListPatientEmergencyContactsHandler
  implements
    IQueryHandler<
      ListPatientEmergencyContactsQuery,
      PatientEmergencyContactReadModel[]
    >
{
  constructor(
    @Inject(PATIENT_EMERGENCY_CONTACT_REPOSITORY)
    private readonly contacts: PatientEmergencyContactRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    query: ListPatientEmergencyContactsQuery,
  ): Promise<PatientEmergencyContactReadModel[]> {
    if (!(await this.patients.existsById(query.patientId)))
      throw new NotFoundException('Patient not found');
    return (await this.contacts.findByPatientId(query.patientId)).map(
      PatientEmergencyContactMapper.toReadModel,
    );
  }
}
