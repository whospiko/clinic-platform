import { randomUUID } from 'crypto';

import { Gender } from './gender.enum';
import { PatientStatus } from './patient-status.enum';

export interface PatientProps {
  id: string;
  code: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  email: string | null;
  nationalId: string | null;
  status: PatientStatus;
  remark: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientProps {
  code: string;
  firstName: string;
  lastName?: string | null;
  gender?: Gender;
  dateOfBirth?: string | null;
  phone?: string | null;
  email?: string | null;
  nationalId?: string | null;
  remark?: string | null;
}

export class PatientAggregate {
  constructor(private readonly props: PatientProps) {}

  static create(input: CreatePatientProps): PatientAggregate {
    const now = new Date();
    const firstName = input.firstName.trim();
    const lastName = input.lastName?.trim() || null;
    const fullName = PatientAggregate.composeFullName(firstName, lastName);

    if (!firstName) {
      //throw new DomainError('Patient firstName is required', 'PATIENT_FIRST_NAME_REQUIRED');
      throw new Error('Patient firstName is required');
    }

    return new PatientAggregate({
      id: randomUUID(),
      code: input.code.trim(),
      firstName,
      lastName,
      fullName,
      gender: input.gender ?? Gender.UNKNOWN,
      dateOfBirth: input.dateOfBirth ?? null,
      phone: input.phone?.trim() || null,
      email: input.email?.trim().toLowerCase() || null,
      nationalId: input.nationalId?.trim() || null,
      status: PatientStatus.ACTIVE,
      remark: input.remark?.trim() || null,
      createdAt: now,
      updatedAt: now,
    });
  }

  updateProfile(input: Partial<Omit<CreatePatientProps, 'code'>>): void {
    const firstName = input.firstName?.trim() ?? this.props.firstName;
    const lastName =
      input.lastName === undefined
        ? this.props.lastName
        : input.lastName?.trim() || null;

    if (!firstName) {
      //throw new DomainError('Patient firstName is required', 'PATIENT_FIRST_NAME_REQUIRED');
      throw new Error('Patient firstName is required');
    }

    this.props.firstName = firstName;
    this.props.lastName = lastName;
    this.props.fullName = PatientAggregate.composeFullName(firstName, lastName);
    this.props.gender = input.gender ?? this.props.gender;
    this.props.dateOfBirth =
      input.dateOfBirth === undefined
        ? this.props.dateOfBirth
        : input.dateOfBirth;
    this.props.phone =
      input.phone === undefined
        ? this.props.phone
        : input.phone?.trim() || null;
    this.props.email =
      input.email === undefined
        ? this.props.email
        : input.email?.trim().toLowerCase() || null;
    this.props.nationalId =
      input.nationalId === undefined
        ? this.props.nationalId
        : input.nationalId?.trim() || null;
    this.props.remark =
      input.remark === undefined
        ? this.props.remark
        : input.remark?.trim() || null;
    this.touch();
  }

  changeStatus(status: PatientStatus): void {
    this.props.status = status;
    this.touch();
  }

  get id(): string {
    return this.props.id;
  }
  get code(): string {
    return this.props.code;
  }
  get firstName(): string {
    return this.props.firstName;
  }
  get lastName(): string | null {
    return this.props.lastName;
  }
  get fullName(): string {
    return this.props.fullName;
  }
  get gender(): Gender {
    return this.props.gender;
  }
  get dateOfBirth(): string | null {
    return this.props.dateOfBirth;
  }
  get phone(): string | null {
    return this.props.phone;
  }
  get email(): string | null {
    return this.props.email;
  }
  get nationalId(): string | null {
    return this.props.nationalId;
  }
  get status(): PatientStatus {
    return this.props.status;
  }
  get remark(): string | null {
    return this.props.remark;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): PatientProps {
    return { ...this.props };
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private static composeFullName(
    firstName: string,
    lastName: string | null,
  ): string {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  }
}
