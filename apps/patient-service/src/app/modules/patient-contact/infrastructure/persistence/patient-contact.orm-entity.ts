import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { PatientOrmEntity } from '../../../patient/infrastructure/persistence/patient.orm-entity';
import { PatientContactType } from '../../domain/patient-contact-type.enum';

@Entity('patient_contacts')
@Index('idx_patient_contacts_patient_type', ['patientId', 'type'])
@Index('idx_patient_contacts_value', ['value'])
export class PatientContactOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @ManyToOne(() => PatientOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientOrmEntity;

  @Column({ type: 'varchar', length: 30 })
  type!: PatientContactType;

  @Column({ type: 'varchar', length: 180 })
  value!: string;

  @Column({ type: 'varchar', length: 80, nullable: true })
  label!: string | null;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

  @Column({
    name: 'verified_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  verifiedAt!: Date | null;

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
