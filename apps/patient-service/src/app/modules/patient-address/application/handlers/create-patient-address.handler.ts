import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_ADDRESS_REPOSITORY } from '../../patient-address.tokens';
import { PatientAddressAggregate } from '../../domain/patient-address.aggregate';
import { PatientAddressMapper } from '../../infrastructure/persistence/patient-address.mapper';
import { CreatePatientAddressCommand } from '../commands/create-patient-address.command';
import { PatientAddressReadModel } from '../dto/patient-address-read-model';
import { PatientAddressRepository } from '../ports/patient-address.repository';

@CommandHandler(CreatePatientAddressCommand)
export class CreatePatientAddressHandler
  implements
    ICommandHandler<CreatePatientAddressCommand, PatientAddressReadModel>
{
  constructor(
    @Inject(PATIENT_ADDRESS_REPOSITORY)
    private readonly addresses: PatientAddressRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    command: CreatePatientAddressCommand,
  ): Promise<PatientAddressReadModel> {
    if (!(await this.patients.existsById(command.patientId)))
      throw new NotFoundException('Patient not found');
    if (command.payload.isPrimary)
      await this.addresses.unsetPrimary(command.patientId);
    const address = PatientAddressAggregate.create({
      patientId: command.patientId,
      ...command.payload,
    });
    return PatientAddressMapper.toReadModel(await this.addresses.save(address));
  }
}
