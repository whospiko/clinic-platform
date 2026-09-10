import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_REPOSITORY } from '../../patient.tokens';
import { PatientStatus } from '../../domain/patient-status.enum';
import { PatientRepository } from '../ports/patient.repository';
import { PatientReadModel } from '../dto/patient-read-model';
import { PatientMapper } from '../../infrastructure/persistence/patient.mapper';
import { ChangePatientStatusCommand } from '../commands/change-patient-status.command';

@CommandHandler(ChangePatientStatusCommand)
export class ChangePatientStatusHandler
  implements ICommandHandler<ChangePatientStatusCommand, PatientReadModel>
{
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(
    command: ChangePatientStatusCommand,
  ): Promise<PatientReadModel> {
    const patient = await this.patients.findById(command.id);
    if (!patient) throw new NotFoundException('Patient not found');

    patient.changeStatus(command.status ?? PatientStatus.ACTIVE);
    const saved = await this.patients.save(patient);
    return PatientMapper.toReadModel(saved);
  }
}
