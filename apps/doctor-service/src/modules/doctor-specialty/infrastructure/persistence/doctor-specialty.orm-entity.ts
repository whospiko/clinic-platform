import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { DoctorOrmEntity } from '../../../doctor/infrastructure/persistence/doctor.orm-entity';
import { SpecialtyOrmEntity } from '../../../specialty/infrastructure/persistence/specialty.orm-entity';
@Entity({ name: 'doctor_specialties' })
@Index('uq_doctor_specialty', ['doctorId', 'specialtyId'], { unique: true })
@Index('idx_doctor_specialties_doctor', ['doctorId'])
@Index('idx_doctor_specialties_specialty', ['specialtyId'])
export class DoctorSpecialtyOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 }) id!: string;
  @Column({ name: 'doctor_id', type: 'varchar', length: 36 }) doctorId!: string;
  @Column({ name: 'specialty_id', type: 'varchar', length: 36 })
  specialtyId!: string;
  @Column({ name: 'is_primary', type: 'boolean', default: false })
  isPrimary!: boolean;
  @Column({ name: 'certified_at', type: 'date', nullable: true }) certifiedAt!:
    | string
    | null;
  @Column({
    name: 'years_experience',
    type: 'smallint',
    unsigned: true,
    nullable: true,
  })
  yearsExperience!: number | null;
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;
  @ManyToOne(() => DoctorOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: DoctorOrmEntity;
  @ManyToOne(() => SpecialtyOrmEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'specialty_id' })
  specialty?: SpecialtyOrmEntity;
}
