import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_REPOSITORY } from '../../patient.tokens';
import { PatientAggregate } from '../../domain/patient.aggregate';
import { PatientRepository } from '../ports/patient.repository';
import { PatientReadModel } from '../dto/patient-read-model';
import { PatientMapper } from '../../infrastructure/persistence/patient.mapper';
import { CreatePatientCommand } from '../commands/create-patient.command';

@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler
  implements ICommandHandler<CreatePatientCommand, PatientReadModel>
{
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(command: CreatePatientCommand): Promise<PatientReadModel> {
    const existing = await this.patients.findByCode(command.payload.code);
    if (existing) {
      throw new ConflictException(
        `Patient code ${command.payload.code} already exists`,
      );
    }

    const patient = PatientAggregate.create(command.payload);
    const saved = await this.patients.save(patient);
    return PatientMapper.toReadModel(saved);
  }
}
