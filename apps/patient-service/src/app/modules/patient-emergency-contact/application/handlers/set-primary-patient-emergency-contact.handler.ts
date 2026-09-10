import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from '../../patient-emergency-contact.tokens';
import { PatientEmergencyContactMapper } from '../../infrastructure/persistence/patient-emergency-contact.mapper';
import { SetPrimaryPatientEmergencyContactCommand } from '../commands/set-primary-patient-emergency-contact.command';
import { PatientEmergencyContactReadModel } from '../dto/patient-emergency-contact-read-model';
import { PatientEmergencyContactRepository } from '../ports/patient-emergency-contact.repository';

@CommandHandler(SetPrimaryPatientEmergencyContactCommand)
export class SetPrimaryPatientEmergencyContactHandler
  implements
    ICommandHandler<
      SetPrimaryPatientEmergencyContactCommand,
      PatientEmergencyContactReadModel
    >
{
  constructor(
    @Inject(PATIENT_EMERGENCY_CONTACT_REPOSITORY)
    private readonly contacts: PatientEmergencyContactRepository,
  ) {}

  async execute(
    command: SetPrimaryPatientEmergencyContactCommand,
  ): Promise<PatientEmergencyContactReadModel> {
    const contact = await this.contacts.findById(command.id);
    if (!contact || contact.patientId !== command.patientId)
      throw new NotFoundException('Emergency contact not found');
    await this.contacts.unsetPrimary(command.patientId, command.id);
    contact.markPrimary();
    return PatientEmergencyContactMapper.toReadModel(
      await this.contacts.save(contact),
    );
  }
}
