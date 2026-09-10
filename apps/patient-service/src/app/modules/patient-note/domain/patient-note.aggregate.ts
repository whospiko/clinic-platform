import { randomUUID } from 'crypto';

import { PatientNoteType } from './patient-note-type.enum';
import { PatientNoteVisibility } from './patient-note-visibility.enum';

export interface PatientNoteProps {
  id: string;
  patientId: string;
  authorId: string | null;
  type: PatientNoteType;
  visibility: PatientNoteVisibility;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class PatientNoteAggregate {
  constructor(private readonly props: PatientNoteProps) {}

  static create(input: {
    patientId: string;
    authorId?: string | null;
    type?: PatientNoteType;
    visibility?: PatientNoteVisibility;
    content: string;
  }): PatientNoteAggregate {
    const content = input.content.trim();
    if (!content) throw new Error('Patient note content is required');
    //throw new DomainError('Patient note content is required', 'PATIENT_NOTE_CONTENT_REQUIRED');
    const now = new Date();
    return new PatientNoteAggregate({
      id: randomUUID(),
      patientId: input.patientId,
      authorId: input.authorId ?? null,
      type: input.type ?? PatientNoteType.GENERAL,
      visibility: input.visibility ?? PatientNoteVisibility.INTERNAL,
      content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    });
  }

  update(
    input: Partial<{
      type: PatientNoteType;
      visibility: PatientNoteVisibility;
      content: string;
    }>,
  ): void {
    if (this.props.deletedAt) throw new Error('Deleted note cannot be updated');

    //throw new DomainError('Deleted note cannot be updated', 'PATIENT_NOTE_DELETED');
    this.props.type = input.type ?? this.props.type;
    this.props.visibility = input.visibility ?? this.props.visibility;
    this.props.content =
      input.content === undefined ? this.props.content : input.content.trim();
    if (!this.props.content)
      throw new Error('Patient note content is required');
    //throw new DomainError('Patient note content is required', 'PATIENT_NOTE_CONTENT_REQUIRED');
    this.touch();
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.touch();
  }

  get id(): string {
    return this.props.id;
  }
  get patientId(): string {
    return this.props.patientId;
  }
  get authorId(): string | null {
    return this.props.authorId;
  }
  get type(): PatientNoteType {
    return this.props.type;
  }
  get visibility(): PatientNoteVisibility {
    return this.props.visibility;
  }
  get content(): string {
    return this.props.content;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }
  toPrimitives(): PatientNoteProps {
    return { ...this.props };
  }
  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
