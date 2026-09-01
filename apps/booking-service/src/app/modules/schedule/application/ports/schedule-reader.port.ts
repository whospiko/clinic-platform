import { DoctorScheduleReadModel } from '../dto/doctor-schedule-read-model';
import { DoctorScheduleOverrideReadModel } from '../dto/doctor-schedule-override-read-model';

export const SCHEDULE_READER_PORT = 'SCHEDULE_READER_PORT';

export interface ScheduleReaderPort {
    getDoctorSchedule(doctorId: string): Promise<DoctorScheduleReadModel | null>;

    getDoctorOverrides(
        doctorId: string,
        from?: string,
        to?: string,
    ): Promise<DoctorScheduleOverrideReadModel[]>;
}