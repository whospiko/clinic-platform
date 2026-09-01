import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ScheduleOverrideRepository } from '../../application/ports/schedule-override.repository';
import { DoctorScheduleOverride } from '../../domain/doctor-schedule-override.aggregate';
import { ScheduleOverrideOrmEntity } from './schedule-override.entity';
import { ScheduleMapper } from './schedule.mapper';

@Injectable()
export class TypeOrmScheduleOverrideRepository
    implements ScheduleOverrideRepository {
    constructor(
        @InjectRepository(ScheduleOverrideOrmEntity)
        private readonly repository: Repository<ScheduleOverrideOrmEntity>,
    ) { }

    async save(override: DoctorScheduleOverride): Promise<void> {
        const entity = ScheduleMapper.toPersistenceOverride(override);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<DoctorScheduleOverride | null> {
        const entity = await this.repository.findOne({
            where: { id },
        });

        return entity ? ScheduleMapper.toDomainOverride(entity) : null;
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete({ id });
    }
}