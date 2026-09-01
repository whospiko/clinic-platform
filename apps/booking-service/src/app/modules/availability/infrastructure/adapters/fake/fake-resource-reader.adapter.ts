import { Injectable } from '@nestjs/common';

import {
    ResourceReaderPort,
} from '../../../application/ports/resource-reader.port';

@Injectable()
export class FakeResourceReaderAdapter implements ResourceReaderPort {
    async doctorExists(): Promise<boolean> {
        return true;
    }

    async getDoctorDefaultAppointmentDurationMinutes(): Promise<number | null> {
        return 30;
    }
}