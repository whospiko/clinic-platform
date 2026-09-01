import { Injectable } from '@nestjs/common';

import {
    HoldBlockReaderPort,
} from '../../../application/ports/hold-block-reader.port';
import { BlockedTimeRange } from '../../../domain/blocked-time-range';

@Injectable()
export class FakeHoldBlockReaderAdapter implements HoldBlockReaderPort {
    async getActiveHoldBlockedRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]> {
        return [
            BlockedTimeRange.create({
                startAt: new Date(`${params.date}T11:00:00.000+07:00`),
                endAt: new Date(`${params.date}T11:30:00.000+07:00`),
                reason: 'HOLD',
            }),
        ];
    }
}