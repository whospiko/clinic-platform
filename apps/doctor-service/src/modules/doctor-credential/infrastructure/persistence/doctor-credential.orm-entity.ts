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
import { CredentialType } from '../../domain/credential-type.enum';
import { CredentialVerificationStatus } from '../../domain/credential-verification-status.enum';
@Entity({ name: 'doctor_credentials' })
@Index('uq_doctor_credential_number', ['doctorId', 'credentialNumber'], {
  unique: true,
})
@Index('idx_doctor_credentials_doctor', ['doctorId'])
@Index('idx_doctor_credentials_status', ['verificationStatus'])
export class DoctorCredentialOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 }) id!: string;
  @Column({ name: 'doctor_id', type: 'varchar', length: 36 }) doctorId!: string;
  @Column({ type: 'enum', enum: CredentialType }) type!: CredentialType;
  @Column({ name: 'credential_number', type: 'varchar', length: 100 })
  credentialNumber!: string;
  @Column({ type: 'varchar', length: 190 }) issuer!: string;
  @Column({ name: 'issued_at', type: 'date', nullable: true }) issuedAt!:
    | string
    | null;
  @Column({ name: 'expires_at', type: 'date', nullable: true }) expiresAt!:
    | string
    | null;
  @Column({
    name: 'document_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  documentUrl!: string | null;
  @Column({
    name: 'verification_status',
    type: 'enum',
    enum: CredentialVerificationStatus,
    default: CredentialVerificationStatus.PENDING,
  })
  verificationStatus!: CredentialVerificationStatus;
  @Column({
    name: 'verified_at',
    type: 'datetime',
    precision: 3,
    nullable: true,
  })
  verifiedAt!: Date | null;
  @Column({
    name: 'verification_note',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  verificationNote!: string | null;
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 3 })
  createdAt!: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 3 })
  updatedAt!: Date;
  @ManyToOne(() => DoctorOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor?: DoctorOrmEntity;
}
