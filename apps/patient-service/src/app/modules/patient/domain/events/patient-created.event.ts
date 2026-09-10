export class PatientCreatedEvent {
  constructor(
    public readonly patientId: string,
    public readonly code: string,
    public readonly fullName: string,
  ) {}
}
