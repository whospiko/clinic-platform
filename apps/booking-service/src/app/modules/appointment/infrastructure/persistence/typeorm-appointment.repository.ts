import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { AppointmentAggregate } from '../../domain/appointment.aggregate';
import { AppointmentStatus } from '../../domain/appointment-status.enum';

import { AppointmentRepository } from '../../application/ports/appointment.repository';
import { AvailabilityCheckerPort } from '../../application/ports/availability-checker.port';

import { AppointmentOrmEntity } from './appointment.orm-entity';
import { AppointmentMapper } from './appointment.mapper';

@Injectable()
export class TypeOrmAppointmentRepository
    implements AppointmentRepository, AvailabilityCheckerPort {
    constructor(
        @InjectRepository(AppointmentOrmEntity)
        private readonly repository: Repository<AppointmentOrmEntity>,
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

    async findByAppointmentNo(appointmentNo: string): Promise<AppointmentAggregate | null> {
        const entity = await this.repository.findOne({
            where: { appointmentNo },
        });

        return entity ? AppointmentMapper.toDomain(entity) : null;
    }

    async assertDoctorAvailable(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
        excludeAppointmentId?: string;
    }): Promise<void> {
        const where: any = {
            doctorId: params.doctorId,
            status: Not(AppointmentStatus.Cancelled),
        };

        if (params.excludeAppointmentId) {
            where.id = Not(params.excludeAppointmentId);
        }

        const appointments = await this.repository.find({
            where,
        });

        const hasOverlap = appointments.some(appointment => {
            return appointment.startAt < params.endAt && appointment.endAt > params.startAt;
        });

        if (hasOverlap) {
            throw new ConflictException('Doctor is not available during this time.');
        }
    }
}