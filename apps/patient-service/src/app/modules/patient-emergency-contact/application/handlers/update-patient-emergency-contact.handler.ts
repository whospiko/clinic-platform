import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from '../../patient-emergency-contact.tokens';
import { PatientEmergencyContactMapper } from '../../infrastructure/persistence/patient-emergency-contact.mapper';
import { UpdatePatientEmergencyContactCommand } from '../commands/update-patient-emergency-contact.command';
import { PatientEmergencyContactReadModel } from '../dto/patient-emergency-contact-read-model';
import { PatientEmergencyContactRepository } from '../ports/patient-emergency-contact.repository';

@CommandHandler(UpdatePatientEmergencyContactCommand)
export class UpdatePatientEmergencyContactHandler
  implements
    ICommandHandler<
      UpdatePatientEmergencyContactCommand,
      PatientEmergencyContactReadModel
    >
{
  constructor(
    @Inject(PATIENT_EMERGENCY_CONTACT_REPOSITORY)
    private readonly contacts: PatientEmergencyContactRepository,
  ) {}

  async execute(
    command: UpdatePatientEmergencyContactCommand,
  ): Promise<PatientEmergencyContactReadModel> {
    const contact = await this.contacts.findById(command.id);
    if (!contact) throw new NotFoundException('Emergency contact not found');
    if (command.payload.isPrimary)
      await this.contacts.unsetPrimary(contact.patientId, contact.id);
    contact.update(command.payload);
    return PatientEmergencyContactMapper.toReadModel(
      await this.contacts.save(contact),
    );
  }
}
