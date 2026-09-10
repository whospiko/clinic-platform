import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { PatientOrmEntity } from '../../../patient/infrastructure/persistence/patient.orm-entity';
import { PatientNoteType } from '../../domain/patient-note-type.enum';
import { PatientNoteVisibility } from '../../domain/patient-note-visibility.enum';

@Entity('patient_notes')
@Index('idx_patient_notes_patient_type', ['patientId', 'type'])
@Index('idx_patient_notes_author', ['authorId'])
@Index('idx_patient_notes_deleted', ['deletedAt'])
export class PatientNoteOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @ManyToOne(() => PatientOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patient_id' })
  patient!: PatientOrmEntity;

  @Column({ name: 'author_id', type: 'varchar', length: 36, nullable: true })
  authorId!: string | null;

  @Column({ type: 'varchar', length: 30, default: PatientNoteType.GENERAL })
  type!: PatientNoteType;

  @Column({
    type: 'varchar',
    length: 30,
    default: PatientNoteVisibility.INTERNAL,
  })
  visibility!: PatientNoteVisibility;

  @Column({ type: 'text' })
  content!: string;

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

  @Column({
    name: 'deleted_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  deletedAt!: Date | null;
}
