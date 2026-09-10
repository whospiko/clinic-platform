import { PatientNoteType } from '../../domain/patient-note-type.enum';

export class ListPatientNotesQuery {
  constructor(
    public readonly patientId: string,
    public readonly type?: PatientNoteType,
  ) {}
}
