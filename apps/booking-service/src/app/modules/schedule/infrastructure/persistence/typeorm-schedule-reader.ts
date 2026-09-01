import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { ScheduleReaderPort } from '../../application/ports/schedule-reader.port';
import { DoctorScheduleReadModel } from '../../application/dto/doctor-schedule-read-model';
import { DoctorScheduleOverrideReadModel } from '../../application/dto/doctor-schedule-override-read-model';

import { ScheduleTemplateOrmEntity } from './schedule-template.entity';
import { ScheduleOverrideOrmEntity } from './schedule-override.entity';

@Injectable()
export class TypeOrmScheduleReader implements ScheduleReaderPort {
    constructor(
        @InjectRepository(ScheduleTemplateOrmEntity)
        private readonly templateRepository: Repository<ScheduleTemplateOrmEntity>,

        @InjectRepository(ScheduleOverrideOrmEntity)
        private readonly overrideRepository: Repository<ScheduleOverrideOrmEntity>,
    ) { }

    async getDoctorSchedule(
        doctorId: string,
    ): Promise<DoctorScheduleReadModel | null> {
        const entity = await this.templateRepository.findOne({
            where: {
                doctorId,
                isActive: true,
            },
            order: {
                effectiveFrom: 'DESC',
            },
            relations: {
                workingWindows: true,
                breakTimes: true,
            },
        });

        if (!entity) {
            return null;
        }

        return {
            id: entity.id,
            doctorId: entity.doctorId,
            clinicId: entity.clinicId,
            timezone: entity.timezone,
            effectiveFrom: entity.effectiveFrom,
            effectiveTo: entity.effectiveTo,
            isActive: entity.isActive,
            workingWindows: entity.workingWindows.map((window) => ({
                id: window.id,
                dayOfWeek: window.dayOfWeek,
                startTime: window.startTime,
                endTime: window.endTime,
                slotDurationMinutes: window.slotDurationMinutes,
                capacity: window.capacity,
            })),
            breakTimes: entity.breakTimes.map((breakTime) => ({
                id: breakTime.id,
                dayOfWeek: breakTime.dayOfWeek,
                startTime: breakTime.startTime,
                endTime: breakTime.endTime,
                reason: breakTime.reason,
            })),
        };
    }

    async getDoctorOverrides(
        doctorId: string,
        from?: string,
        to?: string,
    ): Promise<DoctorScheduleOverrideReadModel[]> {
        const dateCondition =
            from && to
                ? Between(from, to)
                : from
                    ? MoreThanOrEqual(from)
                    : to
                        ? LessThanOrEqual(to)
                        : undefined;

        const entities = await this.overrideRepository.find({
            where: {
                doctorId,
                ...(dateCondition ? { date: dateCondition } : {}),
            },
            order: {
                date: 'ASC',
                startTime: 'ASC',
            },
        });

        return entities.map((entity) => ({
            id: entity.id,
            doctorId: entity.doctorId,
            clinicId: entity.clinicId,
            date: entity.date,
            type: entity.type,
            startTime: entity.startTime,
            endTime: entity.endTime,
            reason: entity.reason,
        }));
    }
}