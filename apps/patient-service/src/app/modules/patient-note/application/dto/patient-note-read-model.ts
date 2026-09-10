import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

export interface PatientNoteReadModel {
  id: string;
  patientId: string;
  authorId: string | null;
  type: PatientNoteType;
  visibility: PatientNoteVisibility;
  content: string;
  createdAt: string;
  updatedAt: string;
}
