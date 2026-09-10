export class CreatePatientEmergencyContactCommand {
  constructor(
    public readonly patientId: string,
    public readonly payload: {
      fullName: string;
      relationship: string;
      phone: string;
      email?: string | null;
      address?: string | null;
      isPrimary?: boolean;
    },
  ) {}
}
