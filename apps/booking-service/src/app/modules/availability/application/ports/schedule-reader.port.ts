import { BlockedTimeRange } from '../../domain/blocked-time-range';
import { WorkingTimeRange } from '../../domain/availability-domain.service';

export const SCHEDULE_READER_PORT = Symbol('SCHEDULE_READER_PORT');

export interface ScheduleReaderPort {
    getDoctorWorkingRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<WorkingTimeRange[]>;

    getDoctorBreakRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]>;

    getDoctorScheduleBlockedRanges(params: {
        doctorId: string;
        date: string;
    }): Promise<BlockedTimeRange[]>;
}