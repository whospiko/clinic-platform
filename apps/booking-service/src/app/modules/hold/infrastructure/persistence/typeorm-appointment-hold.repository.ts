import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AppointmentHoldAggregate } from '../../domain/appointment-hold.aggregate';
import { AppointmentHoldStatus } from '../../domain/appointment-hold-status.enum';
import {
    AppointmentHoldRepository,
    FindActiveOverlappingHoldInput,
} from '../../application/ports/appointment-hold.repository';
import { AppointmentHoldOrmEntity } from './appointment-hold.entity';
import { AppointmentHoldMapper } from './appointment-hold.mapper';

@Injectable()
export class TypeOrmAppointmentHoldRepository implements AppointmentHoldRepository {
    constructor(
        @InjectRepository(AppointmentHoldOrmEntity)
        private readonly repository: Repository<AppointmentHoldOrmEntity>,
    ) { }

    async save(hold: AppointmentHoldAggregate): Promise<AppointmentHoldAggregate> {
        const entity = AppointmentHoldMapper.toOrm(hold);

        const saved = await this.repository.save(entity);

        return AppointmentHoldMapper.toDomain(saved);
    }

    async findById(id: string): Promise<AppointmentHoldAggregate | null> {
        const entity = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!entity) {
            return null;
        }

        return AppointmentHoldMapper.toDomain(entity);
    }

    async findActiveOverlapping(
        input: FindActiveOverlappingHoldInput,
    ): Promise<AppointmentHoldAggregate[]> {
        const qb = this.repository
            .createQueryBuilder('hold')
            .where('hold.status = :status', {
                status: AppointmentHoldStatus.ACTIVE,
            })
            .andWhere('hold.expiresAt > :now', {
                now: input.now,
            })
            .andWhere('hold.startAt < :endAt AND hold.endAt > :startAt', {
                startAt: input.startAt,
                endAt: input.endAt,
            });

        if (input.clinicId) {
            qb.andWhere('hold.clinicId = :clinicId', {
                clinicId: input.clinicId,
            });
        }

        qb.andWhere(
            new Brackets((subQb) => {
                subQb.where('hold.doctorId = :doctorId', {
                    doctorId: input.doctorId,
                });

                if (input.resourceId) {
                    subQb.orWhere('hold.resourceId = :resourceId', {
                        resourceId: input.resourceId,
                    });
                }
            }),
        );

        const entities = await qb.getMany();

        return entities.map(AppointmentHoldMapper.toDomain);
    }
}