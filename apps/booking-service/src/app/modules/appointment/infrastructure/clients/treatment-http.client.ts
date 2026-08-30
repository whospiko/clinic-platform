import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import {
    TreatmentInfo,
    TreatmentReaderPort,
} from '../../application/ports/treatment-reader.port';

@Injectable()
export class TreatmentHttpClient implements TreatmentReaderPort {
    private readonly baseUrl = process.env.TREATMENT_SERVICE_URL ?? 'http://localhost:3003';

    // constructor(
    //     private readonly httpService: HttpService,
    // ) { }

    async getTreatment(treatmentId: string): Promise<TreatmentInfo | null> {
        try {
            // const response = await this.httpService.axiosRef.get<TreatmentInfo>(
            //     `${this.baseUrl}/internal/treatments/${treatmentId}`,
            // );
            // return response.data;
            return {
                id: "1111",
                name: "demo",
                durationMinutes: 1
            }
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null;
            }

            throw new ServiceUnavailableException('Treatment service unavailable.');
        }
    }
}