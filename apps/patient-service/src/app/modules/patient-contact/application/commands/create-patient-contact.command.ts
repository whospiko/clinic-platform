import { PatientContactType } from '../../domain/patient-contact-type.enum';

export class CreatePatientContactCommand {
  constructor(
    public readonly patientId: string,
    public readonly payload: {
      type: PatientContactType;
      value: string;
      label?: string | null;
      isPrimary?: boolean;
    },
  ) {}
}
