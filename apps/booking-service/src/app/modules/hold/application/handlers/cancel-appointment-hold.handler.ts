import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { AppointmentHoldReadModel } from '../dto/appointment-hold-read-model';
import { CancelAppointmentHoldCommand } from '../commands/cancel-appointment-hold.command';
import {
    APPOINTMENT_HOLD_REPOSITORY,
    AppointmentHoldRepository,
} from '../ports/appointment-hold.repository';

@CommandHandler(CancelAppointmentHoldCommand)
export class CancelAppointmentHoldHandler
    implements ICommandHandler<CancelAppointmentHoldCommand, AppointmentHoldReadModel> {
    constructor(
        @Inject(APPOINTMENT_HOLD_REPOSITORY)
        private readonly holdRepository: AppointmentHoldRepository,
    ) { }

    async execute(command: CancelAppointmentHoldCommand): Promise<AppointmentHoldReadModel> {
        const hold = await this.holdRepository.findById(command.holdId);

        if (!hold) {
            throw new NotFoundException('Appointment hold not found.');
        }

        try {
            hold.cancel();
        } catch (error) {
            throw new ConflictException(error instanceof Error ? error.message : 'Cannot cancel hold.');
        }

        const saved = await this.holdRepository.save(hold);

        return saved.toPrimitives();
    }
}