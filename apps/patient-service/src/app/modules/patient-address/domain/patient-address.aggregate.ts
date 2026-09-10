import { randomUUID } from 'crypto';

import { PatientAddressType } from './patient-address-type.enum';

export interface PatientAddressProps {
  id: string;
  patientId: string;
  type: PatientAddressType;
  line1: string;
  line2: string | null;
  commune: string | null;
  district: string | null;
  province: string | null;
  country: string;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PatientAddressAggregate {
  constructor(private readonly props: PatientAddressProps) {}

  static create(input: {
    patientId: string;
    type: PatientAddressType;
    line1: string;
    line2?: string | null;
    commune?: string | null;
    district?: string | null;
    province?: string | null;
    country?: string;
    postalCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isPrimary?: boolean;
  }): PatientAddressAggregate {
    const line1 = input.line1.trim();
    if (!line1) throw new Error('Address line1 is required');
    //throw new DomainError('Address line1 is required', 'ADDRESS_LINE1_REQUIRED');
    const now = new Date();
    return new PatientAddressAggregate({
      id: randomUUID(),
      patientId: input.patientId,
      type: input.type,
      line1,
      line2: input.line2?.trim() || null,
      commune: input.commune?.trim() || null,
      district: input.district?.trim() || null,
      province: input.province?.trim() || null,
      country: input.country?.trim() || 'Cambodia',
      postalCode: input.postalCode?.trim() || null,
      latitude: input.latitude ?? null,
      longitude: input.longitude ?? null,
      isPrimary: input.isPrimary ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  update(
    input: Partial<
      Omit<PatientAddressProps, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>
    >,
  ): void {
    this.props.type = input.type ?? this.props.type;
    this.props.line1 =
      input.line1 === undefined ? this.props.line1 : input.line1.trim();
    this.props.line2 =
      input.line2 === undefined
        ? this.props.line2
        : input.line2?.trim() || null;
    this.props.commune =
      input.commune === undefined
        ? this.props.commune
        : input.commune?.trim() || null;
    this.props.district =
      input.district === undefined
        ? this.props.district
        : input.district?.trim() || null;
    this.props.province =
      input.province === undefined
        ? this.props.province
        : input.province?.trim() || null;
    this.props.country =
      input.country === undefined ? this.props.country : input.country.trim();
    this.props.postalCode =
      input.postalCode === undefined
        ? this.props.postalCode
        : input.postalCode?.trim() || null;
    this.props.latitude =
      input.latitude === undefined ? this.props.latitude : input.latitude;
    this.props.longitude =
      input.longitude === undefined ? this.props.longitude : input.longitude;
    this.props.isPrimary = input.isPrimary ?? this.props.isPrimary;
    if (!this.props.line1) throw new Error('Address line1 is required');
    //throw new DomainError('Address line1 is required', 'ADDRESS_LINE1_REQUIRED');
    if (!this.props.country) throw new Error('Address country is required');
    //throw new DomainError('Address country is required', 'ADDRESS_COUNTRY_REQUIRED');
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
  get type(): PatientAddressType {
    return this.props.type;
  }
  get line1(): string {
    return this.props.line1;
  }
  get line2(): string | null {
    return this.props.line2;
  }
  get commune(): string | null {
    return this.props.commune;
  }
  get district(): string | null {
    return this.props.district;
  }
  get province(): string | null {
    return this.props.province;
  }
  get country(): string {
    return this.props.country;
  }
  get postalCode(): string | null {
    return this.props.postalCode;
  }
  get latitude(): number | null {
    return this.props.latitude;
  }
  get longitude(): number | null {
    return this.props.longitude;
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
  toPrimitives(): PatientAddressProps {
    return { ...this.props };
  }
  private touch(): void {
    this.props.updatedAt = new Date();
  }
}
