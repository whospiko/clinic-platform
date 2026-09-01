import { BlockedTimeRange } from '../../domain/blocked-time-range';

export const APPOINTMENT_BLOCK_READER_PORT = Symbol(
    'APPOINTMENT_BLOCK_READER_PORT',
);

export interface AppointmentBlockReaderPort {
    getAppointmentBlockedRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]>;
}