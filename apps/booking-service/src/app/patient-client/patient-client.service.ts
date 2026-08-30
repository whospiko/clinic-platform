import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

export type PatientForBooking = {
  id: string;
  code: string;
  fullName: string;
  phone: string | null;
  email: string | null;
};

@Injectable()
export class PatientClientService {
  constructor(
    @Inject('PATIENT_SERVICE_CLIENT')
    private readonly patientClient: ClientProxy,
  ) { }

  async getPatientForBooking(patientId: string): Promise<PatientForBooking> {
    try {
      return await firstValueFrom(
        this.patientClient
          .send<PatientForBooking, { patientId: string }>(
            { cmd: 'patient.findForBooking' },
            { patientId },
          )
          .pipe(timeout(3000)),
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Patient service unavailable';

      if (message.includes('Patient not found')) {
        throw new NotFoundException('Patient does not exist');
      }

      throw new BadGatewayException('Patient service unavailable');
    }
  }
}