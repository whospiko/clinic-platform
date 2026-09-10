import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DoctorOrmEntity } from '../../../doctor/infrastructure/persistence/doctor.orm-entity';
import { AssignmentStatus } from '../../domain/assignment-status.enum';
import { EmploymentType } from '../../domain/employment-type.enum';
@Entity({ name: 'doctor_clinic_assignments' })
@Index('idx_dca_doctor', ['doctorId'])
@Index('idx_dca_clinic', ['clinicId'])
@Index('idx_dca_doctor_clinic_status', ['doctorId', 'clinicId', 'status'])
export class DoctorClinicAssignmentOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 }) id!: string;
  @Column({ name: 'doctor_id', type: 'varchar', length: 36 }) doctorId!: string;
  @Column({ name: 'clinic_id', type: 'varchar', length: 36 }) clinicId!: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) title!:
    | string
    | null;
  @Column({ name: 'employment_type', type: 'enum', enum: EmploymentType })
  employmentType!: EmploymentType;
  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;
  @Column({ name: 'start_date', type: 'date' }) startDate!: string;
  @Column({ name: 'end_date', type: 'date', nullable: true }) endDate!:
    | string
    | null;
  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ACTIVE,
  })
  status!: AssignmentStatus;
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;
  @ManyToOne(() => DoctorOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: DoctorOrmEntity;
}
