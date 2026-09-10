import { PatientStatus } from '../../domain/patient-status.enum';

export class ChangePatientStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: PatientStatus,
  ) {}
}
