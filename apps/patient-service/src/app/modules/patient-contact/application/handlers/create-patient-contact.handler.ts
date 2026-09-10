import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_CONTACT_REPOSITORY } from '../../patient-contact.tokens';
import { PatientContactRepository } from '../ports/patient-contact.repository';
import { PatientContactReadModel } from '../dto/patient-contact-read-model';
import { PatientContactAggregate } from '../../domain/patient-contact.aggregate';
import { PatientContactMapper } from '../../infrastructure/persistence/patient-contact.mapper';
import { CreatePatientContactCommand } from '../commands/create-patient-contact.command';

@CommandHandler(CreatePatientContactCommand)
export class CreatePatientContactHandler
  implements
    ICommandHandler<CreatePatientContactCommand, PatientContactReadModel>
{
  constructor(
    @Inject(PATIENT_CONTACT_REPOSITORY)
    private readonly contacts: PatientContactRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    command: CreatePatientContactCommand,
  ): Promise<PatientContactReadModel> {
    const exists = await this.patients.existsById(command.patientId);
    if (!exists) throw new NotFoundException('Patient not found');
    if (command.payload.isPrimary)
      await this.contacts.unsetPrimary(command.patientId);

    const contact = PatientContactAggregate.create({
      patientId: command.patientId,
      ...command.payload,
    });
    return PatientContactMapper.toReadModel(await this.contacts.save(contact));
  }
}
