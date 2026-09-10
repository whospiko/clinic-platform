import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { PatientOrmEntity } from '../../../patient/infrastructure/persistence/patient.orm-entity';

@Entity('patient_emergency_contacts')
@Index('idx_patient_emergency_contacts_patient', ['patientId'])
@Index('idx_patient_emergency_contacts_phone', ['phone'])
export class PatientEmergencyContactOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @ManyToOne(() => PatientOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientOrmEntity;

  @Column({ name: 'full_name', type: 'varchar', length: 180 })
  fullName!: string;

  @Column({ type: 'varchar', length: 80 })
  relationship!: string;

  @Column({ type: 'varchar', length: 30 })
  phone!: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address!: string | null;

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
