import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { PATIENT_NOTE_REPOSITORY } from '../../patient-note.tokens';
import { PatientNoteMapper } from '../../infrastructure/persistence/patient-note.mapper';
import { UpdatePatientNoteCommand } from '../commands/update-patient-note.command';
import { PatientNoteReadModel } from '../dto/patient-note-read-model';
import { PatientNoteRepository } from '../ports/patient-note.repository';

@CommandHandler(UpdatePatientNoteCommand)
export class UpdatePatientNoteHandler
  implements ICommandHandler<UpdatePatientNoteCommand, PatientNoteReadModel>
{
  constructor(
    @Inject(PATIENT_NOTE_REPOSITORY)
    private readonly notes: PatientNoteRepository,
  ) {}

  async execute(
    command: UpdatePatientNoteCommand,
  ): Promise<PatientNoteReadModel> {
    const note = await this.notes.findById(command.id);
    if (!note) throw new NotFoundException('Patient note not found');
    note.update(command.payload);
    return PatientNoteMapper.toReadModel(await this.notes.save(note));
  }
}
