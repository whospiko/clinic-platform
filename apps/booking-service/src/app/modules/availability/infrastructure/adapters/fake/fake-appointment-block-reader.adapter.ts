import { Injectable } from '@nestjs/common';

import {
    AppointmentBlockReaderPort,
} from '../../../application/ports/appointment-block-reader.port';
import { BlockedTimeRange } from '../../../domain/blocked-time-range';

@Injectable()
export class FakeAppointmentBlockReaderAdapter
    implements AppointmentBlockReaderPort {
    async getAppointmentBlockedRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]> {
        return [
            BlockedTimeRange.create({
                startAt: new Date(`${params.date}T09:00:00.000+07:00`),
                endAt: new Date(`${params.date}T09:30:00.000+07:00`),
                reason: 'APPOINTMENT',
            }),
            BlockedTimeRange.create({
                startAt: new Date(`${params.date}T14:00:00.000+07:00`),
                endAt: new Date(`${params.date}T15:00:00.000+07:00`),
                reason: 'APPOINTMENT',
            }),
        ];
    }
}