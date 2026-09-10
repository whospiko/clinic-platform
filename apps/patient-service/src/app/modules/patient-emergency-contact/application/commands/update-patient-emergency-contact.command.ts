export class UpdatePatientEmergencyContactCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      fullName?: string;
      relationship?: string;
      phone?: string;
      email?: string | null;
      address?: string | null;
      isPrimary?: boolean;
    },
  ) {}
}
