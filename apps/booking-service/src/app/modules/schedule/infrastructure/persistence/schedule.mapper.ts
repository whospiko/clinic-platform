import { DoctorScheduleTemplate } from '../../domain/doctor-schedule-template.aggregate';
import { DoctorWorkingWindow } from '../../domain/doctor-working-window.entity';
import { DoctorBreakTime } from '../../domain/doctor-break-time.entity';
import { DoctorScheduleOverride } from '../../domain/doctor-schedule-override.aggregate';

import { ScheduleTemplateOrmEntity } from './schedule-template.entity';
import { WorkingWindowOrmEntity } from './working-window.entity';
import { BreakTimeOrmEntity } from './break-time.entity';
import { ScheduleOverrideOrmEntity } from './schedule-override.entity';

export class ScheduleMapper {
    static toDomainTemplate(entity: ScheduleTemplateOrmEntity): DoctorScheduleTemplate {
        return DoctorScheduleTemplate.rehydrate({
            id: entity.id,
            doctorId: entity.doctorId,
            clinicId: entity.clinicId,
            timezone: entity.timezone,
            effectiveFrom: entity.effectiveFrom,
            effectiveTo: entity.effectiveTo,
            isActive: entity.isActive,
            workingWindows: entity.workingWindows.map((window) =>
                DoctorWorkingWindow.create({
                    id: window.id,
                    templateId: window.templateId,
                    dayOfWeek: window.dayOfWeek,
                    startTime: window.startTime,
                    endTime: window.endTime,
                    slotDurationMinutes: window.slotDurationMinutes,
                    capacity: window.capacity,
                }),
            ),
            breakTimes: entity.breakTimes.map((breakTime) =>
                DoctorBreakTime.create({
                    id: breakTime.id,
                    templateId: breakTime.templateId,
                    dayOfWeek: breakTime.dayOfWeek,
                    startTime: breakTime.startTime,
                    endTime: breakTime.endTime,
                    reason: breakTime.reason,
                }),
            ),
        });
    }

    static toPersistenceTemplate(
        domain: DoctorScheduleTemplate,
    ): ScheduleTemplateOrmEntity {
        const entity = new ScheduleTemplateOrmEntity();

        entity.id = domain.id;
        entity.doctorId = domain.doctorId;
        entity.clinicId = domain.clinicId ?? null;
        entity.timezone = domain.timezone;
        entity.effectiveFrom = domain.effectiveFrom;
        entity.effectiveTo = domain.effectiveTo ?? null;
        entity.isActive = domain.isActive;

        entity.workingWindows = domain.workingWindows.map((window) => {
            const windowEntity = new WorkingWindowOrmEntity();

            windowEntity.id = window.id;
            windowEntity.templateId = domain.id;
            windowEntity.dayOfWeek = window.dayOfWeek;
            windowEntity.startTime = window.startTime;
            windowEntity.endTime = window.endTime;
            windowEntity.slotDurationMinutes = window.slotDurationMinutes;
            windowEntity.capacity = window.capacity;

            return windowEntity;
        });

        entity.breakTimes = domain.breakTimes.map((breakTime) => {
            const breakTimeEntity = new BreakTimeOrmEntity();

            breakTimeEntity.id = breakTime.id;
            breakTimeEntity.templateId = domain.id;
            breakTimeEntity.dayOfWeek = breakTime.dayOfWeek;
            breakTimeEntity.startTime = breakTime.startTime;
            breakTimeEntity.endTime = breakTime.endTime;
            breakTimeEntity.reason = breakTime.reason ?? null;

            return breakTimeEntity;
        });

        return entity;
    }

    static toDomainOverride(entity: ScheduleOverrideOrmEntity): DoctorScheduleOverride {
        return DoctorScheduleOverride.rehydrate({
            id: entity.id,
            doctorId: entity.doctorId,
            clinicId: entity.clinicId,
            date: entity.date,
            type: entity.type,
            startTime: entity.startTime,
            endTime: entity.endTime,
            reason: entity.reason,
        });
    }

    static toPersistenceOverride(
        domain: DoctorScheduleOverride,
    ): ScheduleOverrideOrmEntity {
        const entity = new ScheduleOverrideOrmEntity();

        entity.id = domain.id;
        entity.doctorId = domain.doctorId;
        entity.clinicId = domain.clinicId ?? null;
        entity.date = domain.date;
        entity.type = domain.type;
        entity.startTime = domain.startTime ?? null;
        entity.endTime = domain.endTime ?? null;
        entity.reason = domain.reason ?? null;

        return entity;
    }
}