import { randomUUID } from 'crypto';

export interface PatientEmergencyContactProps {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string | null;
  address: string | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PatientEmergencyContactAggregate {
  constructor(private readonly props: PatientEmergencyContactProps) {}

  static create(input: {
    patientId: string;
    fullName: string;
    relationship: string;
    phone: string;
    email?: string | null;
    address?: string | null;
    isPrimary?: boolean;
  }): PatientEmergencyContactAggregate {
    const fullName = input.fullName.trim();
    const relationship = input.relationship.trim();
    const phone = input.phone.trim();
    if (!fullName) throw new Error('Emergency contact fullName is required');

    //throw new DomainError('Emergency contact fullName is required', 'EMERGENCY_CONTACT_NAME_REQUIRED');

    if (!relationship)
      throw new Error('Emergency contact relationship is required');

    //throw new DomainError('Emergency contact relationship is required', 'EMERGENCY_CONTACT_RELATIONSHIP_REQUIRED');

    if (!phone) throw new Error('Emergency contact phone is required');

    //throw new DomainError('Emergency contact phone is required', 'EMERGENCY_CONTACT_PHONE_REQUIRED');

    const now = new Date();
    return new PatientEmergencyContactAggregate({
      id: randomUUID(),
      patientId: input.patientId,
      fullName,
      relationship,
      phone,
      email: input.email?.trim().toLowerCase() || null,
      address: input.address?.trim() || null,
      isPrimary: input.isPrimary ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(
    input: Partial<
      Omit<
        PatientEmergencyContactProps,
        'id' | 'patientId' | 'createdAt' | 'updatedAt'
      >
    >,
  ): void {
    this.props.fullName =
      input.fullName === undefined
        ? this.props.fullName
        : input.fullName.trim();
    this.props.relationship =
      input.relationship === undefined
        ? this.props.relationship
        : input.relationship.trim();
    this.props.phone =
      input.phone === undefined ? this.props.phone : input.phone.trim();
    this.props.email =
      input.email === undefined
        ? this.props.email
        : input.email?.trim().toLowerCase() || null;
    this.props.address =
      input.address === undefined
        ? this.props.address
        : input.address?.trim() || null;
    this.props.isPrimary = input.isPrimary ?? this.props.isPrimary;
    if (!this.props.fullName)
      throw new Error('Emergency contact fullName is required');
    //throw new DomainError('Emergency contact fullName is required', 'EMERGENCY_CONTACT_NAME_REQUIRED');
    if (!this.props.relationship)
      throw new Error('Emergency contact relationship is required');
    //throw new DomainError('Emergency contact relationship is required', 'EMERGENCY_CONTACT_RELATIONSHIP_REQUIRED');
    if (!this.props.phone)
      throw new Error('Emergency contact phone is required');
    //throw new DomainError('Emergency contact phone is required', 'EMERGENCY_CONTACT_PHONE_REQUIRED');
    this.touch();
  }

  markPrimary(): void {
    this.props.isPrimary = true;
    this.touch();
  }

  get id(): string {
    return this.props.id;
  }
  get patientId(): string {
    return this.props.patientId;
  }
  get fullName(): string {
    return this.props.fullName;
  }
  get relationship(): string {
    return this.props.relationship;
  }
  get phone(): string {
    return this.props.phone;
  }
  get email(): string | null {
    return this.props.email;
  }
  get address(): string | null {
    return this.props.address;
  }
  get isPrimary(): boolean {
    return this.props.isPrimary;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  toPrimitives(): PatientEmergencyContactProps {
    return { ...this.props };
  }
  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
