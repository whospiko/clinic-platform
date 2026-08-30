import { Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ConfirmAppointmentCommand } from '../commands/confirm-appointment.command';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';

import {
    APPOINTMENT_REPOSITORY,
    AppointmentRepository,
} from '../ports/appointment.repository';

@CommandHandler(ConfirmAppointmentCommand)
export class ConfirmAppointmentHandler
    implements ICommandHandler<ConfirmAppointmentCommand, AppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: AppointmentRepository,
    ) { }

    async execute(command: ConfirmAppointmentCommand): Promise<AppointmentResponseDto> {
        const appointment = await this.appointmentRepository.findById(command.appointmentId);

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        try {
            appointment.confirm();
        } catch (error) {
            throw new BadRequestException((error as Error).message);
        }

        await this.appointmentRepository.save(appointment);

        return AppointmentResponseDto.fromDomain(appointment);
    }
}