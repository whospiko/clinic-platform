import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { PatientOrmEntity } from '../../../patient/infrastructure/persistence/patient.orm-entity';
import { PatientAddressType } from '../../domain/patient-address-type.enum';

@Entity('patient_addresses')
@Index('idx_patient_addresses_patient_type', ['patientId', 'type'])
export class PatientAddressOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @ManyToOne(() => PatientOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientOrmEntity;

  @Column({ type: 'varchar', length: 30 })
  type!: PatientAddressType;

  @Column({ type: 'varchar', length: 255 })
  line1!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  line2!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  commune!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  district!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  province!: string | null;

  @Column({ type: 'varchar', length: 120, default: 'Cambodia' })
  country!: string;

  @Column({ name: 'postal_code', type: 'varchar', length: 30, nullable: true })
  postalCode!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude!: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude!: string | null;

  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;

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
