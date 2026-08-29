import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type PatientForBooking = {
  id: string;
  code: string;
  fullName: string;
  phone: string | null;
  email: string | null;
};

@Injectable()
export class PatientClientService {
  constructor(private readonly configService: ConfigService) {}

  async getPatientForBooking(patientId: string): Promise<PatientForBooking> {
    const baseUrl = this.configService.getOrThrow<string>('PATIENT_SERVICE_URL');

    const response = await fetch(`${baseUrl}/internal/patients/${patientId}`);

    if (response.status === 404) {
      throw new NotFoundException('Patient does not exist');
    }

    if (!response.ok) {
      throw new BadGatewayException('Patient service unavailable');
    }

    return response.json() as Promise<PatientForBooking>;
  }
}