import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from '../../patient-emergency-contact.tokens';
import { PatientEmergencyContactAggregate } from '../../domain/patient-emergency-contact.aggregate';
import { PatientEmergencyContactMapper } from '../../infrastructure/persistence/patient-emergency-contact.mapper';
import { CreatePatientEmergencyContactCommand } from '../commands/create-patient-emergency-contact.command';
import { PatientEmergencyContactReadModel } from '../dto/patient-emergency-contact-read-model';
import { PatientEmergencyContactRepository } from '../ports/patient-emergency-contact.repository';

@CommandHandler(CreatePatientEmergencyContactCommand)
export class CreatePatientEmergencyContactHandler
  implements
    ICommandHandler<
      CreatePatientEmergencyContactCommand,
      PatientEmergencyContactReadModel
    >
{
  constructor(
    @Inject(PATIENT_EMERGENCY_CONTACT_REPOSITORY)
    private readonly contacts: PatientEmergencyContactRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    command: CreatePatientEmergencyContactCommand,
  ): Promise<PatientEmergencyContactReadModel> {
    if (!(await this.patients.existsById(command.patientId)))
      throw new NotFoundException('Patient not found');
    if (command.payload.isPrimary)
      await this.contacts.unsetPrimary(command.patientId);
    const contact = PatientEmergencyContactAggregate.create({
      patientId: command.patientId,
      ...command.payload,
    });
    return PatientEmergencyContactMapper.toReadModel(
      await this.contacts.save(contact),
    );
  }
}
