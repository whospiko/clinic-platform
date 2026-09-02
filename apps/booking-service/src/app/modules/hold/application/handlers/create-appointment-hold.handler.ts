import { ConflictException, Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';

import { AppointmentHoldAggregate } from '../../domain/appointment-hold.aggregate';
import { AppointmentHoldReadModel } from '../dto/appointment-hold-read-model';
import { CreateAppointmentHoldCommand } from '../commands/create-appointment-hold.command';
import {
    APPOINTMENT_HOLD_REPOSITORY,
    AppointmentHoldRepository,
} from '../ports/appointment-hold.repository';

@CommandHandler(CreateAppointmentHoldCommand)
export class CreateAppointmentHoldHandler
    implements ICommandHandler<CreateAppointmentHoldCommand, AppointmentHoldReadModel> {
    constructor(
        @Inject(APPOINTMENT_HOLD_REPOSITORY)
        private readonly holdRepository: AppointmentHoldRepository,
    ) { }

    async execute(command: CreateAppointmentHoldCommand): Promise<AppointmentHoldReadModel> {
        const now = new Date();

        const startAt = new Date(command.props.startAt);
        const endAt = new Date(command.props.endAt);

        if (Number.isNaN(startAt.getTime())) {
            throw new ConflictException('Invalid startAt.');
        }

        if (Number.isNaN(endAt.getTime())) {
            throw new ConflictException('Invalid endAt.');
        }

        if (endAt <= startAt) {
            throw new ConflictException('endAt must be after startAt.');
        }

        const ttlSeconds = command.props.ttlSeconds ?? 300;

        const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);

        const overlappingHolds = await this.holdRepository.findActiveOverlapping({
            clinicId: command.props.clinicId,
            doctorId: command.props.doctorId,
            resourceId: command.props.resourceId,
            startAt,
            endAt,
            now,
        });

        if (overlappingHolds.length > 0) {
            throw new ConflictException('This appointment slot is already temporarily held.');
        }

        const hold = AppointmentHoldAggregate.create({
            id: randomUUID(),
            clinicId: command.props.clinicId,
            doctorId: command.props.doctorId,
            patientId: command.props.patientId,
            resourceId: command.props.resourceId,
            startAt,
            endAt,
            expiresAt,
            reason: command.props.reason,
            now,
        });

        const saved = await this.holdRepository.save(hold);

        return saved.toPrimitives();
    }
}