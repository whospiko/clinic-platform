export class SetPrimaryPatientContactCommand {
  constructor(
    public readonly patientId: string,
    public readonly id: string,
  ) {}
}
