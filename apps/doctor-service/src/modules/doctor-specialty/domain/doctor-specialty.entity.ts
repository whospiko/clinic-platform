import { randomUUID } from 'crypto';

export interface DoctorSpecialtyProps {
  id: string;
  doctorId: string;
  specialtyId: string;
  isPrimary: boolean;
  certifiedAt: Date | null;
  yearsExperience: number | null;
  createdAt: Date;
}
export class DoctorSpecialtyEntity {
  private constructor(private props: DoctorSpecialtyProps) {}
  static create(input: Omit<DoctorSpecialtyProps, 'id' | 'createdAt'>) {
    return new DoctorSpecialtyEntity({
      ...input,
      id: randomUUID(),
      createdAt: new Date(),
    });
  }
  static rehydrate(props: DoctorSpecialtyProps) {
    return new DoctorSpecialtyEntity(props);
  }
  get snapshot(): Readonly<DoctorSpecialtyProps> {
    return this.props;
  }
  setPrimary(value: boolean) {
    this.props.isPrimary = value;
  }
}
