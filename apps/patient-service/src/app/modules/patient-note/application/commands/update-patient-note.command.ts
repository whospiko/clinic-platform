import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

export class UpdatePatientNoteCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      type?: PatientNoteType;
      visibility?: PatientNoteVisibility;
      content?: string;
    },
  ) {}
}
