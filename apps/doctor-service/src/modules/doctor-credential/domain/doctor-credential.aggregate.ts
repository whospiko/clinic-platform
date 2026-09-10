import { randomUUID } from 'crypto';
import { CredentialType } from './credential-type.enum';
import { CredentialVerificationStatus } from './credential-verification-status.enum';

export interface DoctorCredentialProps {
  id: string;
  doctorId: string;
  type: CredentialType;
  credentialNumber: string;
  issuer: string;
  issuedAt: Date | null;
  expiresAt: Date | null;
  documentUrl: string | null;
  verificationStatus: CredentialVerificationStatus;
  verifiedAt: Date | null;
  verificationNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class DoctorCredentialAggregate {
  private constructor(private props: DoctorCredentialProps) {}
  static create(
    input: Omit<
      DoctorCredentialProps,
      | 'id'
      | 'verificationStatus'
      | 'verifiedAt'
      | 'verificationNote'
      | 'createdAt'
      | 'updatedAt'
    >,
  ) {
    const now = new Date();
    return new DoctorCredentialAggregate({
      ...input,
      id: randomUUID(),
      verificationStatus: CredentialVerificationStatus.PENDING,
      verifiedAt: null,
      verificationNote: null,
      createdAt: now,
      updatedAt: now,
    });
  }
  static rehydrate(p: DoctorCredentialProps) {
    return new DoctorCredentialAggregate(p);
  }
  get snapshot(): Readonly<DoctorCredentialProps> {
    return this.props;
  }
  verify(note?: string | null) {
    this.props.verificationStatus = CredentialVerificationStatus.VERIFIED;
    this.props.verifiedAt = new Date();
    this.props.verificationNote = note ?? null;
    this.props.updatedAt = new Date();
  }
  reject(note: string) {
    this.props.verificationStatus = CredentialVerificationStatus.REJECTED;
    this.props.verifiedAt = new Date();
    this.props.verificationNote = note;
    this.props.updatedAt = new Date();
  }
}
