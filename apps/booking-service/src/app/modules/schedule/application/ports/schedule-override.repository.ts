import { DoctorScheduleOverride } from '../../domain/doctor-schedule-override.aggregate';

export const SCHEDULE_OVERRIDE_REPOSITORY = 'SCHEDULE_OVERRIDE_REPOSITORY';

export interface ScheduleOverrideRepository {
    save(override: DoctorScheduleOverride): Promise<void>;

    findById(id: string): Promise<DoctorScheduleOverride | null>;

    delete(id: string): Promise<void>;
}