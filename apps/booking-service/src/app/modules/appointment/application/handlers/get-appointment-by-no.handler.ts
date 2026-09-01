import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAppointmentByNoQuery } from '../queries/get-appointment-by-no.query';
import {
    APPOINTMENT_QUERY_REPOSITORY,
    AppointmentQueryRepository,
} from '../ports/appointment-query.repository';

import { AppointmentResponseDto } from '../dto/appointment-response.dto';

@QueryHandler(GetAppointmentByNoQuery)
export class GetAppointmentByNoHandler
    implements IQueryHandler<GetAppointmentByNoQuery, AppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_QUERY_REPOSITORY)
        private readonly appointmentQueryRepository: AppointmentQueryRepository,
    ) { }

    async execute(
        query: GetAppointmentByNoQuery,
    ): Promise<AppointmentResponseDto> {
        const appointment =
            await this.appointmentQueryRepository.findByAppointmentNo(
                query.appointmentNo,
            );

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        return AppointmentResponseDto.fromDomain(appointment);
    }
}