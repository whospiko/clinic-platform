import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { DoctorValidatorPort } from '../../application/ports/doctor-validator.port';

@Injectable()
export class DoctorHttpClient implements DoctorValidatorPort {
    private readonly baseUrl = process.env.DOCTOR_SERVICE_URL ?? 'http://localhost:3002';

    // constructor(
    //     private readonly httpService: HttpService,
    // ) { }

    async ensureDoctorExists(doctorId: string): Promise<void> {
        try {
            // await this.httpService.axiosRef.get(
            //     `${this.baseUrl}/internal/doctors/${doctorId}`,
            // );
        } catch (error: any) {
            if (error.response?.status === 404) {
                throw new NotFoundException('Doctor not found.');
            }

            throw new ServiceUnavailableException('Doctor service unavailable.');
        }
    }
}