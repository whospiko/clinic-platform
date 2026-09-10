import { randomUUID } from 'crypto';
import { AssignmentStatus } from './assignment-status.enum';
import { EmploymentType } from './employment-type.enum';
export interface DoctorClinicAssignmentProps {
  id: string;
  doctorId: string;
  clinicId: string;
  title: string | null;
  employmentType: EmploymentType;
  isPrimary: boolean;
  startDate: Date;
  endDate: Date | null;
  status: AssignmentStatus;
  createdAt: Date;
  updatedAt: Date;
}
export class DoctorClinicAssignmentAggregate {
  private constructor(private props: DoctorClinicAssignmentProps) {}
  static create(
    input: Omit<
      DoctorClinicAssignmentProps,
      'id' | 'status' | 'createdAt' | 'updatedAt'
    >,
  ) {
    const now = new Date();
    return new DoctorClinicAssignmentAggregate({
      ...input,
      id: randomUUID(),
      status: AssignmentStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    });
  }
  static rehydrate(props: DoctorClinicAssignmentProps) {
    return new DoctorClinicAssignmentAggregate(props);
  }
  get snapshot(): Readonly<DoctorClinicAssignmentProps> {
    return this.props;
  }
  update(
    input: Partial<
      Pick<
        DoctorClinicAssignmentProps,
        | 'title'
        | 'employmentType'
        | 'isPrimary'
        | 'startDate'
        | 'endDate'
        | 'status'
      >
    >,
  ) {
    this.props = { ...this.props, ...input, updatedAt: new Date() };
  }
}
