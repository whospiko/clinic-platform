import { DoctorScheduleTemplate } from '../../domain/doctor-schedule-template.aggregate';

export const SCHEDULE_TEMPLATE_REPOSITORY = 'SCHEDULE_TEMPLATE_REPOSITORY';

export interface ScheduleTemplateRepository {
    save(template: DoctorScheduleTemplate): Promise<void>;

    findById(id: string): Promise<DoctorScheduleTemplate | null>;

    findActiveByDoctorId(
        doctorId: string,
    ): Promise<DoctorScheduleTemplate | null>;
}