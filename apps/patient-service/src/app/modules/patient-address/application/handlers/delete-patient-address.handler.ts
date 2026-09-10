import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeletePatientAddressCommand } from '../commands/delete-patient-address.command';
import { PatientAddressRepository } from '../ports/patient-address.repository';
import { PATIENT_ADDRESS_REPOSITORY } from '../../patient-address.tokens';

@CommandHandler(DeletePatientAddressCommand)
export class DeletePatientAddressHandler
  implements ICommandHandler<DeletePatientAddressCommand, { deleted: true }>
{
  constructor(
    @Inject(PATIENT_ADDRESS_REPOSITORY)
    private readonly addresses: PatientAddressRepository,
  ) {}

  async execute(
    command: DeletePatientAddressCommand,
  ): Promise<{ deleted: true }> {
    const address = await this.addresses.findById(command.id);
    if (!address) throw new NotFoundException('Patient address not found');
    await this.addresses.delete(command.id);
    return { deleted: true };
  }
}
