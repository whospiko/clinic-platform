import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_ADDRESS_REPOSITORY } from '../../patient-address.tokens';
import { PatientAddressMapper } from '../../infrastructure/persistence/patient-address.mapper';
import { SetPrimaryPatientAddressCommand } from '../commands/set-primary-patient-address.command';
import { PatientAddressReadModel } from '../dto/patient-address-read-model';
import { PatientAddressRepository } from '../ports/patient-address.repository';

@CommandHandler(SetPrimaryPatientAddressCommand)
export class SetPrimaryPatientAddressHandler
  implements
    ICommandHandler<SetPrimaryPatientAddressCommand, PatientAddressReadModel>
{
  constructor(
    @Inject(PATIENT_ADDRESS_REPOSITORY)
    private readonly addresses: PatientAddressRepository,
  ) {}

  async execute(
    command: SetPrimaryPatientAddressCommand,
  ): Promise<PatientAddressReadModel> {
    const address = await this.addresses.findById(command.id);
    if (!address || address.patientId !== command.patientId)
      throw new NotFoundException('Patient address not found');
    await this.addresses.unsetPrimary(command.patientId, command.id);
    address.markPrimary();
    return PatientAddressMapper.toReadModel(await this.addresses.save(address));
  }
}
