import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ListAppointmentsQuery } from '../queries/list-appointments.query';
import {
    APPOINTMENT_QUERY_REPOSITORY,
    AppointmentQueryRepository,
} from '../ports/appointment-query.repository';

import { AppointmentResponseDto } from '../dto/appointment-response.dto';
import { PaginatedAppointmentResponseDto } from '../dto/paginated-appointment-response.dto';

@QueryHandler(ListAppointmentsQuery)
export class ListAppointmentsHandler
    implements IQueryHandler<ListAppointmentsQuery, PaginatedAppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_QUERY_REPOSITORY)
        private readonly appointmentQueryRepository: AppointmentQueryRepository,
    ) { }

    async execute(
        query: ListAppointmentsQuery,
    ): Promise<PaginatedAppointmentResponseDto> {
        const result = await this.appointmentQueryRepository.findMany(query.filter);

        return {
            items: result.items.map(AppointmentResponseDto.fromDomain),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
}