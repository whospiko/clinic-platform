import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

export class CreatePatientNoteCommand {
  constructor(
    public readonly patientId: string,
    public readonly payload: {
      authorId?: string | null;
      type?: PatientNoteType;
      visibility?: PatientNoteVisibility;
      content: string;
    },
  ) {}
}
