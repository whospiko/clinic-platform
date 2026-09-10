import { PatientContactType } from '../../domain/patient-contact-type.enum';

export class UpdatePatientContactCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      type?: PatientContactType;
      value?: string;
      label?: string | null;
      isPrimary?: boolean;
    },
  ) {}
}
