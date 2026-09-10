import { Gender } from '../../domain/gender.enum';

export class UpdatePatientCommand {
  constructor(
    public readonly id: string,
    public readonly payload: {
      firstName?: string;
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
