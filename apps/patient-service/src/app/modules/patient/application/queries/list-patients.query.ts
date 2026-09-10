import { Gender } from '../../domain/gender.enum';
import { PatientStatus } from '../../domain/patient-status.enum';

export class ListPatientsQuery {
  constructor(
    public readonly params: {
      page: number;
      limit: number;
      q?: string;
      code?: string;
      phone?: string;
      email?: string;
      gender?: Gender;
      status?: PatientStatus;
    },
  ) {}
}
