import { randomUUID } from 'crypto';
import { DoctorGender } from './doctor-gender.enum';
import { DoctorStatus } from './doctor-status.enum';

export interface DoctorProps {
  id: string;
  userId: string | null;
  employeeCode: string;
  firstName: string;
  lastName: string;
  displayName: string;
  gender: DoctorGender;
  dateOfBirth: Date | null;
  phone: string | null;
  email: string | null;
  bio: string | null;
  yearsExperience: number;
  status: DoctorStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class DoctorAggregate {
  private constructor(private props: DoctorProps) {}

  static create(
    input: Omit<DoctorProps, 'id' | 'status' | 'createdAt' | 'updatedAt'>,
  ): DoctorAggregate {
    if (!input.employeeCode.trim())
      throw new Error('Employee code is required');
    if (!input.firstName.trim() || !input.lastName.trim())
      throw new Error('Doctor name is required');
    if (input.yearsExperience < 0)
      throw new Error('Years of experience cannot be negative');
    const now = new Date();
    return new DoctorAggregate({
      ...input,
      id: randomUUID(),
      status: DoctorStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
  }

  static rehydrate(props: DoctorProps): DoctorAggregate {
    return new DoctorAggregate(props);
  }
  get snapshot(): Readonly<DoctorProps> {
    return this.props;
  }

  updateProfile(
    input: Partial<
      Pick<
        DoctorProps,
        | 'firstName'
        | 'lastName'
        | 'displayName'
        | 'gender'
        | 'dateOfBirth'
        | 'phone'
        | 'email'
        | 'bio'
        | 'yearsExperience'
        | 'userId'
      >
    >,
  ): void {
    if (input.yearsExperience !== undefined && input.yearsExperience < 0)
      throw new Error('Years of experience cannot be negative');
    this.props = { ...this.props, ...input, updatedAt: new Date() };
  }

  changeStatus(status: DoctorStatus): void {
    this.props.status = status;
    this.props.updatedAt = new Date();
  }
}
