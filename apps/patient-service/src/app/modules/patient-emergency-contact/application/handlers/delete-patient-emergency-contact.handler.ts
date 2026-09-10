import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeletePatientEmergencyContactCommand } from '../commands/delete-patient-emergency-contact.command';
import { PatientEmergencyContactRepository } from '../ports/patient-emergency-contact.repository';
import { PATIENT_EMERGENCY_CONTACT_REPOSITORY } from '../../patient-emergency-contact.tokens';

@CommandHandler(DeletePatientEmergencyContactCommand)
export class DeletePatientEmergencyContactHandler
  implements
    ICommandHandler<DeletePatientEmergencyContactCommand, { deleted: true }>
{
  constructor(
    @Inject(PATIENT_EMERGENCY_CONTACT_REPOSITORY)
    private readonly contacts: PatientEmergencyContactRepository,
  ) {}

  async execute(
    command: DeletePatientEmergencyContactCommand,
  ): Promise<{ deleted: true }> {
    const contact = await this.contacts.findById(command.id);
    if (!contact) throw new NotFoundException('Emergency contact not found');
    await this.contacts.delete(command.id);
    return { deleted: true };
  }
}
