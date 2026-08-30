import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { PatientValidatorPort } from '../../application/ports/patient-validator.port';

@Injectable()
export class PatientHttpClient implements PatientValidatorPort {
    private readonly baseUrl = process.env.PATIENT_SERVICE_URL ?? 'http://localhost:3001';

    // constructor(
    //     private readonly httpService: HttpService,
    // ) { }

    async ensurePatientExists(patientId: string): Promise<void> {
        try {
            // await this.httpService.axiosRef.get(
            //     `${this.baseUrl}/internal/patients/${patientId}`,
            // );
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new NotFoundException('Patient not found.');
            }

            throw new ServiceUnavailableException('Patient service unavailable.');
        }
    }
}