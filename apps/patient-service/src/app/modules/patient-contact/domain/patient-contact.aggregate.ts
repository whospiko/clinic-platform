import { randomUUID } from 'crypto';

import { PatientContactType } from './patient-contact-type.enum';

export interface PatientContactProps {
  id: string;
  patientId: string;
  type: PatientContactType;
  value: string;
  label: string | null;
  isPrimary: boolean;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class PatientContactAggregate {
  constructor(private readonly props: PatientContactProps) {}

  static create(input: {
    patientId: string;
    type: PatientContactType;
    value: string;
    label?: string | null;
    isPrimary?: boolean;
  }): PatientContactAggregate {
    const now = new Date();
    const value = input.value.trim();
    if (!value) Error('Contact value is required');
    //throw new DomainError('Contact value is required', 'CONTACT_VALUE_REQUIRED');

    return new PatientContactAggregate({
      id: randomUUID(),
      patientId: input.patientId,
      type: input.type,
      value,
      label: input.label?.trim() || null,
      isPrimary: input.isPrimary ?? false,
      verifiedAt: null,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(
    input: Partial<{
      type: PatientContactType;
      value: string;
      label: string | null;
      isPrimary: boolean;
    }>,
  ): void {
    this.props.type = input.type ?? this.props.type;
    this.props.value =
      input.value === undefined ? this.props.value : input.value.trim();
    this.props.label =
      input.label === undefined
        ? this.props.label
        : input.label?.trim() || null;
    this.props.isPrimary = input.isPrimary ?? this.props.isPrimary;
    if (!this.props.value) throw new Error('Contact value is required');
    //throw new DomainError('Contact value is required', 'CONTACT_VALUE_REQUIRED');
    this.touch();
  }

  markPrimary(): void {
    this.props.isPrimary = true;
    this.touch();
  }

  verify(verifiedAt = new Date()): void {
    this.props.verifiedAt = verifiedAt;
    this.touch();
  }

  get id(): string {
    return this.props.id;
  }
  get patientId(): string {
    return this.props.patientId;
  }
  get type(): PatientContactType {
    return this.props.type;
  }
  get value(): string {
    return this.props.value;
  }
  get label(): string | null {
    return this.props.label;
  }
  get isPrimary(): boolean {
    return this.props.isPrimary;
  }
  get verifiedAt(): Date | null {
    return this.props.verifiedAt;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PatientContactProps {
    return { ...this.props };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
