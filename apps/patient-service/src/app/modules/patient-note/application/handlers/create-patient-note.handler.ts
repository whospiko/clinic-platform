import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_NOTE_REPOSITORY } from '../../patient-note.tokens';
import { PatientNoteAggregate } from '../../domain/patient-note.aggregate';
import { PatientNoteMapper } from '../../infrastructure/persistence/patient-note.mapper';
import { CreatePatientNoteCommand } from '../commands/create-patient-note.command';
import { PatientNoteReadModel } from '../dto/patient-note-read-model';
import { PatientNoteRepository } from '../ports/patient-note.repository';

@CommandHandler(CreatePatientNoteCommand)
export class CreatePatientNoteHandler
  implements ICommandHandler<CreatePatientNoteCommand, PatientNoteReadModel>
{
  constructor(
    @Inject(PATIENT_NOTE_REPOSITORY)
    private readonly notes: PatientNoteRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(
    command: CreatePatientNoteCommand,
  ): Promise<PatientNoteReadModel> {
    if (!(await this.patients.existsById(command.patientId)))
      throw new NotFoundException('Patient not found');
    const note = PatientNoteAggregate.create({
      patientId: command.patientId,
      ...command.payload,
    });
    return PatientNoteMapper.toReadModel(await this.notes.save(note));
  }
}
