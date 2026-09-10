import { Gender } from '../../domain/gender.enum';

export class CreatePatientCommand {
  constructor(
    public readonly payload: {
      code: string;
      firstName: string;
      lastName?: string | null;
      gender?: Gender;
      dateOfBirth?: string | null;
      phone?: string | null;
      email?: string | null;
      nationalId?: string | null;
      remark?: string | null;
    },
  ) {}
}
