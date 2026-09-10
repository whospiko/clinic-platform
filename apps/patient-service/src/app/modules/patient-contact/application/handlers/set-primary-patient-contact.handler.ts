import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { SetPrimaryPatientContactCommand } from '../commands/set-primary-patient-contact.command';
import { PatientContactReadModel } from '../dto/patient-contact-read-model';
import { PatientContactRepository } from '../ports/patient-contact.repository';
import { PATIENT_CONTACT_REPOSITORY } from '../../patient-contact.tokens';
import { PatientContactMapper } from '../../infrastructure/persistence/patient-contact.mapper';

@CommandHandler(SetPrimaryPatientContactCommand)
export class SetPrimaryPatientContactHandler
  implements
    ICommandHandler<SetPrimaryPatientContactCommand, PatientContactReadModel>
{
  constructor(
    @Inject(PATIENT_CONTACT_REPOSITORY)
    private readonly contacts: PatientContactRepository,
  ) {}

  async execute(
    command: SetPrimaryPatientContactCommand,
  ): Promise<PatientContactReadModel> {
    const contact = await this.contacts.findById(command.id);
    if (!contact || contact.patientId !== command.patientId)
      throw new NotFoundException('Patient contact not found');
    await this.contacts.unsetPrimary(command.patientId, command.id);
    contact.markPrimary();
    return PatientContactMapper.toReadModel(await this.contacts.save(contact));
  }
}
