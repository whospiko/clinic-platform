export class SetPrimaryPatientEmergencyContactCommand {
  constructor(
    public readonly patientId: string,
    public readonly id: string,
  ) {}
}
