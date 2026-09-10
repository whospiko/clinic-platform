import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_REPOSITORY } from '../../patient.tokens';
import { PatientRepository } from '../ports/patient.repository';
import { PatientReadModel } from '../dto/patient-read-model';
import { PatientMapper } from '../../infrastructure/persistence/patient.mapper';
import { UpdatePatientCommand } from '../commands/update-patient.command';

@CommandHandler(UpdatePatientCommand)
export class UpdatePatientHandler
  implements ICommandHandler<UpdatePatientCommand, PatientReadModel>
{
  constructor(
    @Inject(PATIENT_REPOSITORY) private readonly patients: PatientRepository,
  ) {}

  async execute(command: UpdatePatientCommand): Promise<PatientReadModel> {
    const patient = await this.patients.findById(command.id);
    if (!patient) throw new NotFoundException('Patient not found');

    patient.updateProfile(command.payload);
    const saved = await this.patients.save(patient);
    return PatientMapper.toReadModel(saved);
  }
}
