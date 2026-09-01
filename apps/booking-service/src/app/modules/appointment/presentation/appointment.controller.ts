import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { AppointmentSource } from '../domain/appointment-source.enum';

import { CreateAppointmentRequest } from './dto/create-appointment.request';
import { CancelAppointmentRequest } from './dto/cancel-appointment.request';
import { RescheduleAppointmentRequest } from './dto/reschedule-appointment.request';
import { ListAppointmentsRequest } from './dto/list-appointments.request';
import { CheckAvailabilityRequest } from './dto/check-availability.request';
import { DoctorBusySlotsRequest } from './dto/doctor-busy-slots.request';

import { CreateAppointmentCommand } from '../application/commands/create-appointment.command';
import { ConfirmAppointmentCommand } from '../application/commands/confirm-appointment.command';
import { CancelAppointmentCommand } from '../application/commands/cancel-appointment.command';
import { RescheduleAppointmentCommand } from '../application/commands/reschedule-appointment.command';
import { CompleteAppointmentCommand } from '../application/commands/complete-appointment.command';

import { AppointmentResponseDto } from '../application/dto/appointment-response.dto';
import { PaginatedAppointmentResponseDto } from '../application/dto/paginated-appointment-response.dto';
import { AppointmentStatusHistoryResponseDto } from '../application/dto/appointment-status-history-response.dto';
import { AvailabilityResponseDto } from '../application/dto/availability-response.dto';
import { BusySlotResponseDto } from '../application/dto/busy-slot-response.dto';

import { ListAppointmentsQuery } from '../application/queries/list-appointments.query';
import { GetAppointmentQuery } from '../application/queries/get-appointment.query';
import { GetAppointmentByNoQuery } from '../application/queries/get-appointment-by-no.query';
import { GetAppointmentHistoryQuery } from '../application/queries/get-appointment-history.query';
import { GetDoctorBusySlotsQuery } from '../application/queries/get-doctor-busy-slots.query';
import { CheckDoctorAvailabilityQuery } from '../application/queries/check-doctor-availability.query';

@Controller()
export class AppointmentController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) { }

    /**
     * GET /appointments
     *
     * Examples:
     * /appointments?page=1&limit=20
     * /appointments?doctorId=xxx&from=2026-09-01T00:00:00.000Z&to=2026-09-02T00:00:00.000Z
     * /appointments?patientId=xxx
     * /appointments?status=CONFIRMED
     */
    @Get('appointments')
    async list(
        @Query() request: ListAppointmentsRequest,
    ): Promise<PaginatedAppointmentResponseDto> {
        return this.queryBus.execute(
            new ListAppointmentsQuery({
                page: request.page ?? 1,
                limit: request.limit ?? 20,
                patientId: request.patientId,
                doctorId: request.doctorId,
                treatmentId: request.treatmentId,
                status: request.status,
                source: request.source,
                from: request.from ? new Date(request.from) : undefined,
                to: request.to ? new Date(request.to) : undefined,
                s: request.s,
            }),
        );
    }

    /**
     * GET /appointments/availability/check
     */
    @Get('appointments/availability/check')
    async checkAvailability(
        @Query() request: CheckAvailabilityRequest,
    ): Promise<AvailabilityResponseDto> {
        return this.queryBus.execute(
            new CheckDoctorAvailabilityQuery(
                request.doctorId,
                new Date(request.startAt),
                new Date(request.endAt),
                request.excludeAppointmentId,
            ),
        );
    }

    /**
     * GET /appointments/no/:appointmentNo
     *
     * Important:
     * Keep this before GET /appointments/:id,
     * otherwise Nest may treat "no" as an id.
     */
    @Get('appointments/no/:appointmentNo')
    async getByAppointmentNo(
        @Param('appointmentNo') appointmentNo: string,
    ): Promise<AppointmentResponseDto> {
        return this.queryBus.execute(
            new GetAppointmentByNoQuery(appointmentNo),
        );
    }

    /**
     * GET /appointments/:id
     */
    @Get('appointments/:id')
    async getById(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentResponseDto> {
        return this.queryBus.execute(
            new GetAppointmentQuery(appointmentId),
        );
    }

    /**
     * GET /appointments/:id/status-history
     */
    @Get('appointments/:id/status-history')
    async getStatusHistory(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentStatusHistoryResponseDto[]> {
        return this.queryBus.execute(
            new GetAppointmentHistoryQuery(appointmentId),
        );
    }

    /**
     * GET /appointments/patients/:patientId
     */
    @Get('appointments/patients/:patientId')
    async getPatientAppointments(
        @Param('patientId') patientId: string,
        @Query() request: ListAppointmentsRequest,
    ): Promise<PaginatedAppointmentResponseDto> {
        return this.queryBus.execute(
            new ListAppointmentsQuery({
                page: request.page ?? 1,
                limit: request.limit ?? 20,
                patientId,
                status: request.status,
                source: request.source,
                from: request.from ? new Date(request.from) : undefined,
                to: request.to ? new Date(request.to) : undefined,
                s: request.s,
            }),
        );
    }

    /**
     * GET /appointments/doctors/:doctorId/calendar
     */
    @Get('appointments/doctors/:doctorId/calendar')
    async getDoctorCalendar(
        @Param('doctorId') doctorId: string,
        @Query() request: ListAppointmentsRequest,
    ): Promise<PaginatedAppointmentResponseDto> {
        return this.queryBus.execute(
            new ListAppointmentsQuery({
                page: request.page ?? 1,
                limit: request.limit ?? 100,
                doctorId,
                status: request.status,
                source: request.source,
                from: request.from ? new Date(request.from) : undefined,
                to: request.to ? new Date(request.to) : undefined,
                s: request.s,
            }),
        );
    }

    /**
     * GET /internal/appointments/doctors/:doctorId/busy-slots
     *
     * This is useful for schedule-service or doctor-service.
     */
    @Get('internal/appointments/doctors/:doctorId/busy-slots')
    async getDoctorBusySlots(
        @Param('doctorId') doctorId: string,
        @Query() request: DoctorBusySlotsRequest,
    ): Promise<BusySlotResponseDto[]> {
        return this.queryBus.execute(
            new GetDoctorBusySlotsQuery(
                doctorId,
                new Date(request.from),
                new Date(request.to),
            ),
        );
    }

    /**
     * POST /appointments
     */
    @Post('appointments')
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

    /**
     * PATCH /appointments/:id/confirm
     */
    @Patch('appointments/:id/confirm')
    async confirm(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new ConfirmAppointmentCommand(appointmentId),
        );
    }

    /**
     * PATCH /appointments/:id/cancel
     */
    @Patch('appointments/:id/cancel')
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

    /**
     * PATCH /appointments/:id/reschedule
     */
    @Patch('appointments/:id/reschedule')
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

    /**
     * PATCH /appointments/:id/complete
     */
    @Patch('appointments/:id/complete')
    async complete(
        @Param('id') appointmentId: string,
    ): Promise<AppointmentResponseDto> {
        return this.commandBus.execute(
            new CompleteAppointmentCommand(appointmentId),
        );
    }
}