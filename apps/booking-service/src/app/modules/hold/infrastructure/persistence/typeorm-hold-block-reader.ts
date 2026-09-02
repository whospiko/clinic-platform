import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AppointmentHoldStatus } from '../../domain/appointment-hold-status.enum';
import { AppointmentHoldReadModel } from '../../application/dto/appointment-hold-read-model';
import {
    FindActiveHoldBlocksInput,
    HoldBlockReaderPort,
} from '../../application/ports/hold-block-reader.port';
import { AppointmentHoldOrmEntity } from './appointment-hold.entity';

@Injectable()
export class TypeOrmHoldBlockReader implements HoldBlockReaderPort {
    constructor(
        @InjectRepository(AppointmentHoldOrmEntity)
        private readonly repository: Repository<AppointmentHoldOrmEntity>,
    ) { }

    async findActiveBlocks(input: FindActiveHoldBlocksInput): Promise<AppointmentHoldReadModel[]> {
        const now = input.now ?? new Date();

        const qb = this.repository
            .createQueryBuilder('hold')
            .where('hold.status = :status', {
                status: AppointmentHoldStatus.ACTIVE,
            })
            .andWhere('hold.expiresAt > :now', {
                now,
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

        return entities.map((entity) => ({
            id: entity.id,
            clinicId: entity.clinicId,
            doctorId: entity.doctorId,
            patientId: entity.patientId,
            resourceId: entity.resourceId,
            appointmentId: entity.appointmentId,
            startAt: entity.startAt,
            endAt: entity.endAt,
            expiresAt: entity.expiresAt,
            status: entity.status,
            reason: entity.reason,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        }));
    }
}