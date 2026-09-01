import { ScheduleOverrideType } from '../../domain/schedule-override-type.enum';

export type DoctorScheduleOverrideReadModel = {
    id: string;
    doctorId: string;
    clinicId?: string | null;
    date: string;
    type: ScheduleOverrideType;
    startTime?: string | null;
    endTime?: string | null;
    reason?: string | null;
};