import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PATIENT_READER } from '../../../patient/patient.tokens';
import { PatientReaderPort } from '../../../patient/application/ports/patient-reader.port';
import { PATIENT_NOTE_REPOSITORY } from '../../patient-note.tokens';
import { PatientNoteMapper } from '../../infrastructure/persistence/patient-note.mapper';
import { PatientNoteReadModel } from '../dto/patient-note-read-model';
import { PatientNoteRepository } from '../ports/patient-note.repository';
import { ListPatientNotesQuery } from '../queries/list-patient-notes.query';

@QueryHandler(ListPatientNotesQuery)
export class ListPatientNotesHandler
  implements IQueryHandler<ListPatientNotesQuery, PatientNoteReadModel[]>
{
  constructor(
    @Inject(PATIENT_NOTE_REPOSITORY)
    private readonly notes: PatientNoteRepository,
    @Inject(PATIENT_READER) private readonly patients: PatientReaderPort,
  ) {}

  async execute(query: ListPatientNotesQuery): Promise<PatientNoteReadModel[]> {
    if (!(await this.patients.existsById(query.patientId)))
      throw new NotFoundException('Patient not found');
    return (
      await this.notes.findMany({
        patientId: query.patientId,
        type: query.type,
      })
    ).map(PatientNoteMapper.toReadModel);
  }
}
