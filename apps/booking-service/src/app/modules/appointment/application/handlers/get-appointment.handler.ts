import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAppointmentQuery } from '../queries/get-appointment.query';
import {
    APPOINTMENT_QUERY_REPOSITORY,
    AppointmentQueryRepository,
} from '../ports/appointment-query.repository';

import { AppointmentResponseDto } from '../dto/appointment-response.dto';

@QueryHandler(GetAppointmentQuery)
export class GetAppointmentHandler
    implements IQueryHandler<GetAppointmentQuery, AppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_QUERY_REPOSITORY)
        private readonly appointmentQueryRepository: AppointmentQueryRepository,
    ) { }

    async execute(query: GetAppointmentQuery): Promise<AppointmentResponseDto> {
        const appointment = await this.appointmentQueryRepository.findById(
            query.appointmentId,
        );

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        return AppointmentResponseDto.fromDomain(appointment);
    }
}