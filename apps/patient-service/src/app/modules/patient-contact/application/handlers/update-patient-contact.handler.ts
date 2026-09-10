import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_CONTACT_REPOSITORY } from '../../patient-contact.tokens';
import { PatientContactMapper } from '../../infrastructure/persistence/patient-contact.mapper';
import { PatientContactReadModel } from '../dto/patient-contact-read-model';
import { UpdatePatientContactCommand } from '../commands/update-patient-contact.command';
import { PatientContactRepository } from '../ports/patient-contact.repository';

@CommandHandler(UpdatePatientContactCommand)
export class UpdatePatientContactHandler
  implements
    ICommandHandler<UpdatePatientContactCommand, PatientContactReadModel>
{
  constructor(
    @Inject(PATIENT_CONTACT_REPOSITORY)
    private readonly contacts: PatientContactRepository,
  ) {}

  async execute(
    command: UpdatePatientContactCommand,
  ): Promise<PatientContactReadModel> {
    const contact = await this.contacts.findById(command.id);
    if (!contact) throw new NotFoundException('Patient contact not found');
    if (command.payload.isPrimary)
      await this.contacts.unsetPrimary(contact.patientId, contact.id);
    contact.update(command.payload);
    return PatientContactMapper.toReadModel(await this.contacts.save(contact));
  }
}
