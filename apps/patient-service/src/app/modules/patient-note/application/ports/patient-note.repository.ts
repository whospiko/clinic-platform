import { PatientNoteAggregate } from '../../domain/patient-note.aggregate';
import { PatientNoteType } from '../../domain/patient-note-type.enum';

export interface PatientNoteSearchCriteria {
  patientId: string;
  type?: PatientNoteType;
}

export interface PatientNoteRepository {
  save(note: PatientNoteAggregate): Promise<PatientNoteAggregate>;
  findById(id: string): Promise<PatientNoteAggregate | null>;
  findMany(
    criteria: PatientNoteSearchCriteria,
  ): Promise<PatientNoteAggregate[]>;
}
