import { BlockedTimeRange } from '../../domain/blocked-time-range';

export const HOLD_BLOCK_READER_PORT = Symbol('HOLD_BLOCK_READER_PORT');

export interface HoldBlockReaderPort {
    getActiveHoldBlockedRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]>;
}