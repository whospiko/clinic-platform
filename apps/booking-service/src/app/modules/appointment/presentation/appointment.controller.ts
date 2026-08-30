import {
    Body,
    Controller,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AppointmentSource } from '../domain/appointment-source.enum';

import { CreateAppointmentRequest } from './dto/create-appointment.request';
import { CancelAppointmentRequest } from './dto/cancel-appointment.request';
import { RescheduleAppointmentRequest } from './dto/reschedule-appointment.request';

import { CreateAppointmentCommand } from '../application/commands/create-appointment.command';
import { ConfirmAppointmentCommand } from '../application/commands/confirm-appointment.command';
import { CancelAppointmentCommand } from '../application/commands/cancel-appointment.command';
import { RescheduleAppointmentCommand } from '../application/commands/reschedule-appointment.command';
import { CompleteAppointmentCommand } from '../application/commands/complete-appointment.command';

import { AppointmentResponseDto } from '../application/dto/appointment-response.dto';

@Controller('appointments')
export class AppointmentController {
    constructor(
        private readonly commandBus: CommandBus,
    ) { }

    @Post()
    async create(
        @Body() request: CreateAppointmentRequest,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new CreateAppointmentCommand(
                request.patientId,
                request.doctorId,
                request.treatmentId ?? null,
                new Date(request.startAt),
                request.endAt ? new Date(request.endAt) : null,
                request.source ?? AppointmentSource.Reception,
                request.note ?? null,
            ),
        );
    }

    @Patch(':id/confirm')
    async confirm(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new ConfirmAppointmentCommand(appointmentId),
        );
    }

    @Patch(':id/cancel')
    async cancel(
        @Param('id') appointmentId: string,
        @Body() request: CancelAppointmentRequest,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new CancelAppointmentCommand(
                appointmentId,
                request.reason,
            ),
        );
    }

    @Patch(':id/reschedule')
    async reschedule(
        @Param('id') appointmentId: string,
        @Body() request: RescheduleAppointmentRequest,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new RescheduleAppointmentCommand(
                appointmentId,
                new Date(request.startAt),
                request.endAt ? new Date(request.endAt) : null,
                request.treatmentId ?? null,
                request.note ?? null,
            ),
        );
    }

    @Patch(':id/complete')
    async complete(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new CompleteAppointmentCommand(appointmentId),
        );
    }
}