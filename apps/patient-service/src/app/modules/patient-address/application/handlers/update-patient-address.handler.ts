import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_ADDRESS_REPOSITORY } from '../../patient-address.tokens';
import { PatientAddressMapper } from '../../infrastructure/persistence/patient-address.mapper';
import { UpdatePatientAddressCommand } from '../commands/update-patient-address.command';
import { PatientAddressReadModel } from '../dto/patient-address-read-model';
import { PatientAddressRepository } from '../ports/patient-address.repository';

@CommandHandler(UpdatePatientAddressCommand)
export class UpdatePatientAddressHandler
  implements
    ICommandHandler<UpdatePatientAddressCommand, PatientAddressReadModel>
{
  constructor(
    @Inject(PATIENT_ADDRESS_REPOSITORY)
    private readonly addresses: PatientAddressRepository,
  ) {}

  async execute(
    command: UpdatePatientAddressCommand,
  ): Promise<PatientAddressReadModel> {
    const address = await this.addresses.findById(command.id);
    if (!address) throw new NotFoundException('Patient address not found');
    if (command.payload.isPrimary)
      await this.addresses.unsetPrimary(address.patientId, address.id);
    address.update(command.payload);
    return PatientAddressMapper.toReadModel(await this.addresses.save(address));
  }
}
