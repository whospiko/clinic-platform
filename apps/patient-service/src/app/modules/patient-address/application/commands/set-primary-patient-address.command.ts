export class SetPrimaryPatientAddressCommand {
  constructor(
    public readonly patientId: string,
    public readonly id: string,
  ) {}
}
