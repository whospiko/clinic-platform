import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { Gender } from '../../domain/gender.enum';
import { PatientStatus } from '../../domain/patient-status.enum';

@Entity('patient_profiles')
@Index('idx_patient_profiles_name', ['fullName'])
@Index('idx_patient_profiles_phone', ['phone'])
@Index('idx_patient_profiles_status', ['status'])
export class PatientOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code!: string;

  @Column({ name: 'first_name', type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100, nullable: true })
  lastName!: string | null;

  @Column({ name: 'full_name', type: 'varchar', length: 220 })
  fullName!: string;

  @Column({ type: 'varchar', length: 20, default: Gender.UNKNOWN })
  gender!: Gender;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth!: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone!: string | null;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email!: string | null;

  @Column({ name: 'national_id', type: 'varchar', length: 100, nullable: true })
  nationalId!: string | null;

  @Column({ type: 'varchar', length: 30, default: PatientStatus.ACTIVE })
  status!: PatientStatus;

  @Column({ type: 'text', nullable: true })
  remark!: string | null;

  @Column({
    name: 'created_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
  })
  createdAt!: Date;

  @Column({
    name: 'updated_at',
    type: 'datetime',
    precision: 3,
    default: () => 'CURRENT_TIMESTAMP(3)',
    onUpdate: 'CURRENT_TIMESTAMP(3)',
  })
  updatedAt!: Date;
}
