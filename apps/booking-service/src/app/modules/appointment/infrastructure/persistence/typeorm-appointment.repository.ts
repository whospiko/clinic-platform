import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { AppointmentAggregate } from '../../domain/appointment.aggregate';
import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentStatusHistoryEntity } from '../../domain/appointment-status-history.entity';

import { AppointmentRepository } from '../../application/ports/appointment.repository';
import { AvailabilityCheckerPort } from '../../application/ports/availability-checker.port';
import {
    AppointmentListFilter,
    AppointmentPageResult,
    AppointmentQueryRepository,
    BusySlot,
} from '../../application/ports/appointment-query.repository';

import { AppointmentStatusHistoryOrmEntity } from './appointment-status-history.entity';
import { AppointmentMapper } from './appointment.mapper';
import { AppointmentOrmEntity } from './appointment.entity';

@Injectable()
export class TypeOrmAppointmentRepository
    implements AppointmentRepository, AppointmentQueryRepository, AvailabilityCheckerPort {
    
    constructor(
        @InjectRepository(AppointmentOrmEntity)
        private readonly repository: Repository<AppointmentOrmEntity>,

        @InjectRepository(AppointmentStatusHistoryOrmEntity)
        private readonly historyRepository: Repository<AppointmentStatusHistoryOrmEntity>,
    ) { }

    async save(appointment: AppointmentAggregate): Promise<void> {
        const entity = AppointmentMapper.toOrm(appointment);
        await this.repository.save(entity);
    }

    async findById(id: string): Promise<AppointmentAggregate | null> {
        const entity = await this.repository.findOne({
            where: { id },
        });

        return entity ? AppointmentMapper.toDomain(entity) : null;
    }

    async findByAppointmentNo(
        appointmentNo: string,
    ): Promise<AppointmentAggregate | null> {
        const entity = await this.repository.findOne({
            where: { appointmentNo },
        });

        return entity ? AppointmentMapper.toDomain(entity) : null;
    }

    async findMany(
        filter: AppointmentListFilter,
    ): Promise<AppointmentPageResult> {
        const page = Math.max(filter.page || 1, 1);
        const limit = Math.min(Math.max(filter.limit || 20, 1), 100);

        const qb = this.repository
            .createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.histories', 'histories');

        if (filter.patientId) {
            qb.andWhere('appointment.patientId = :patientId', {
                patientId: filter.patientId,
            });
        }

        if (filter.doctorId) {
            qb.andWhere('appointment.doctorId = :doctorId', {
                doctorId: filter.doctorId,
            });
        }

        if (filter.treatmentId) {
            qb.andWhere('appointment.treatmentId = :treatmentId', {
                treatmentId: filter.treatmentId,
            });
        }

        if (filter.status) {
            qb.andWhere('appointment.status = :status', {
                status: filter.status,
            });
        }

        if (filter.source) {
            qb.andWhere('appointment.source = :source', {
                source: filter.source,
            });
        }

        /**
         * Range overlap logic:
         * appointment.startAt < filter.to
         * appointment.endAt > filter.from
         *
         * This means appointments that touch the requested calendar range.
         */
        if (filter.from) {
            qb.andWhere('appointment.endAt > :from', {
                from: filter.from,
            });
        }

        if (filter.to) {
            qb.andWhere('appointment.startAt < :to', {
                to: filter.to,
            });
        }

        if (filter.s) {
            qb.andWhere(
                new Brackets((searchQb) => {
                    searchQb
                        .where('appointment.appointmentNo LIKE :search', {
                            search: `%${filter.s}%`,
                        })
                        .orWhere('appointment.patientId LIKE :search', {
                            search: `%${filter.s}%`,
                        })
                        .orWhere('appointment.doctorId LIKE :search', {
                            search: `%${filter.s}%`,
                        });
                }),
            );
        }

        qb.orderBy('appointment.startAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        const [entities, total] = await qb.getManyAndCount();

        return {
            items: entities.map(AppointmentMapper.toDomain),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findStatusHistories(
        appointmentId: string,
    ): Promise<AppointmentStatusHistoryEntity[]> {
        const histories = await this.historyRepository.find({
            where: { appointmentId },
            order: {
                changedAt: 'ASC',
            },
        });

        return histories.map((history) => {
            return new AppointmentStatusHistoryEntity(
                history.id,
                history.appointmentId,
                history.fromStatus,
                history.toStatus,
                history.reason,
                history.changedAt,
            );
        });
    }

    async findBusySlotsByDoctor(params: {
        doctorId: string;
        from: Date;
        to: Date;
    }): Promise<BusySlot[]> {
        const busyStatuses = [
            AppointmentStatus.Requested,
            AppointmentStatus.Confirmed,
        ];

        const appointments = await this.repository
            .createQueryBuilder('appointment')
            .where('appointment.doctorId = :doctorId', {
                doctorId: params.doctorId,
            })
            .andWhere('appointment.status IN (:...busyStatuses)', {
                busyStatuses,
            })
            .andWhere('appointment.startAt < :to', {
                to: params.to,
            })
            .andWhere('appointment.endAt > :from', {
                from: params.from,
            })
            .orderBy('appointment.startAt', 'ASC')
            .getMany();

        return appointments.map((appointment) => ({
            appointmentId: appointment.id,
            appointmentNo: appointment.appointmentNo,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            status: appointment.status,
            startAt: appointment.startAt,
            endAt: appointment.endAt,
        }));
    }

    async assertDoctorAvailable(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
        excludeAppointmentId?: string;
    }): Promise<void> {
        const available = await this.isDoctorAvailable(params);

        if (!available) {
            throw new ConflictException('Doctor is not available during this time.');
        }
    }

    async isDoctorAvailable(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
        excludeAppointmentId?: string;
    }): Promise<boolean> {
        const busyStatuses = [
            AppointmentStatus.Requested,
            AppointmentStatus.Confirmed,
        ];

        const qb = this.repository
            .createQueryBuilder('appointment')
            .where('appointment.doctorId = :doctorId', {
                doctorId: params.doctorId,
            })
            .andWhere('appointment.status IN (:...busyStatuses)', {
                busyStatuses,
            })
            .andWhere('appointment.startAt < :endAt', {
                endAt: params.endAt,
            })
            .andWhere('appointment.endAt > :startAt', {
                startAt: params.startAt,
            });

        if (params.excludeAppointmentId) {
            qb.andWhere('appointment.id != :excludeAppointmentId', {
                excludeAppointmentId: params.excludeAppointmentId,
            });
        }

        const conflictCount = await qb.getCount();

        return conflictCount === 0;
    }
}