import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScheduleTemplateRepository } from '../../application/ports/schedule-template.repository';
import { DoctorScheduleTemplate } from '../../domain/doctor-schedule-template.aggregate';
import { ScheduleTemplateOrmEntity } from './schedule-template.entity';
import { ScheduleMapper } from './schedule.mapper';

@Injectable()
export class TypeOrmScheduleTemplateRepository
    implements ScheduleTemplateRepository {
    constructor(
        @InjectRepository(ScheduleTemplateOrmEntity)
        private readonly repository: Repository<ScheduleTemplateOrmEntity>,
    ) { }

    async save(template: DoctorScheduleTemplate): Promise<void> {
        const entity = ScheduleMapper.toPersistenceTemplate(template);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<DoctorScheduleTemplate | null> {
        const entity = await this.repository.findOne({
            where: { id },
            relations: {
                workingWindows: true,
                breakTimes: true,
            },
        });

        return entity ? ScheduleMapper.toDomainTemplate(entity) : null;
    }

    async findActiveByDoctorId(
        doctorId: string,
    ): Promise<DoctorScheduleTemplate | null> {
        const entity = await this.repository.findOne({
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

        return entity ? ScheduleMapper.toDomainTemplate(entity) : null;
    }
}