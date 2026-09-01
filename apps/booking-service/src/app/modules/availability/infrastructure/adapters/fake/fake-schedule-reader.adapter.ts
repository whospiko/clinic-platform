import { Injectable } from '@nestjs/common';

import {
    ScheduleReaderPort,
} from '../../../application/ports/schedule-reader.port';
import {
    WorkingTimeRange,
} from '../../../domain/availability-domain.service';
import { BlockedTimeRange } from '../../../domain/blocked-time-range';

@Injectable()
export class FakeScheduleReaderAdapter implements ScheduleReaderPort {
    async getDoctorWorkingRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<WorkingTimeRange[]> {
        return [
            {
                startAt: new Date(`${params.date}T08:00:00.000+07:00`),
                endAt: new Date(`${params.date}T12:00:00.000+07:00`),
            },
            {
                startAt: new Date(`${params.date}T13:00:00.000+07:00`),
                endAt: new Date(`${params.date}T17:00:00.000+07:00`),
            },
        ];
    }

    async getDoctorBreakRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]> {
        return [
            BlockedTimeRange.create({
                startAt: new Date(`${params.date}T10:00:00.000+07:00`),
                endAt: new Date(`${params.date}T10:15:00.000+07:00`),
                reason: 'BREAK',
            }),
        ];
    }

    async getDoctorScheduleBlockedRanges(): Promise<BlockedTimeRange[]> {
        return [];
    }
}