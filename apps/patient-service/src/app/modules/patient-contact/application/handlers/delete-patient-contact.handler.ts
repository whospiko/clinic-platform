import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeletePatientContactCommand } from '../commands/delete-patient-contact.command';
import { PatientContactRepository } from '../ports/patient-contact.repository';
import { PATIENT_CONTACT_REPOSITORY } from '../../patient-contact.tokens';

@CommandHandler(DeletePatientContactCommand)
export class DeletePatientContactHandler
  implements ICommandHandler<DeletePatientContactCommand, { deleted: true }>
{
  constructor(
    @Inject(PATIENT_CONTACT_REPOSITORY)
    private readonly contacts: PatientContactRepository,
  ) {}

  async execute(
    command: DeletePatientContactCommand,
  ): Promise<{ deleted: true }> {
    const contact = await this.contacts.findById(command.id);
    if (!contact) throw new NotFoundException('Patient contact not found');
    await this.contacts.delete(command.id);
    return { deleted: true };
  }
}
