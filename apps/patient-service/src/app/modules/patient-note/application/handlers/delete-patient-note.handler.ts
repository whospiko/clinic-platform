import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { DeletePatientNoteCommand } from '../commands/delete-patient-note.command';
import { PatientNoteRepository } from '../ports/patient-note.repository';
import { PATIENT_NOTE_REPOSITORY } from '../../patient-note.tokens';

@CommandHandler(DeletePatientNoteCommand)
export class DeletePatientNoteHandler
  implements ICommandHandler<DeletePatientNoteCommand, { deleted: true }>
{
  constructor(
    @Inject(PATIENT_NOTE_REPOSITORY)
    private readonly notes: PatientNoteRepository,
  ) {}

  async execute(command: DeletePatientNoteCommand): Promise<{ deleted: true }> {
    const note = await this.notes.findById(command.id);
    if (!note) throw new NotFoundException('Patient note not found');
    note.softDelete();
    await this.notes.save(note);
    return { deleted: true };
  }
}
