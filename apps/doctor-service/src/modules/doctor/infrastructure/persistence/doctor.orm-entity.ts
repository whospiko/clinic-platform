import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorGender } from '../../domain/doctor-gender.enum';
import { DoctorStatus } from '../../domain/doctor-status.enum';

@Entity({ name: 'doctors' })
@Index('uq_doctors_employee_code', ['employeeCode'], { unique: true })
@Index('uq_doctors_user_id', ['userId'], { unique: true })
@Index('idx_doctors_status', ['status'])
export class DoctorOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 }) id!: string;
  @Column({ name: 'user_id', type: 'varchar', length: 36, nullable: true })
  userId!: string | null;
  @Column({ name: 'employee_code', type: 'varchar', length: 50 })
  employeeCode!: string;
  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName!: string;
  @Column({ name: 'display_name', type: 'varchar', length: 200 })
  displayName!: string;
  @Column({
    type: 'enum',
    enum: DoctorGender,
    default: DoctorGender.UNSPECIFIED,
  })
  gender!: DoctorGender;
  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;
  @Column({ type: 'varchar', length: 30, nullable: true }) phone!:
    | string
    | null;
  @Column({ type: 'varchar', length: 190, nullable: true }) email!:
    | string
    | null;
  @Column({ type: 'text', nullable: true }) bio!: string | null;
  @Column({
    name: 'years_experience',
    type: 'smallint',
    unsigned: true,
    default: 0,
  })
  yearsExperience!: number;
  @Column({ type: 'enum', enum: DoctorStatus, default: DoctorStatus.ACTIVE })
  status!: DoctorStatus;
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;
}
