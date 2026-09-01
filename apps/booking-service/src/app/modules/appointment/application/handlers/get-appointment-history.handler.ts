import { Inject, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAppointmentHistoryQuery } from '../queries/get-appointment-history.query';
import {
    APPOINTMENT_QUERY_REPOSITORY,
    AppointmentQueryRepository,
} from '../ports/appointment-query.repository';

import { AppointmentStatusHistoryResponseDto } from '../dto/appointment-status-history-response.dto';

@QueryHandler(GetAppointmentHistoryQuery)
export class GetAppointmentHistoryHandler
    implements IQueryHandler<
        GetAppointmentHistoryQuery,
        AppointmentStatusHistoryResponseDto[]
    > {
    constructor(
        @Inject(APPOINTMENT_QUERY_REPOSITORY)
        private readonly appointmentQueryRepository: AppointmentQueryRepository,
    ) { }

    async execute(
        query: GetAppointmentHistoryQuery,
    ): Promise<AppointmentStatusHistoryResponseDto[]> {
        const appointment = await this.appointmentQueryRepository.findById(
            query.appointmentId,
        );

        if (!appointment) {
            throw new NotFoundException('Appointment not found.');
        }

        const histories =
            await this.appointmentQueryRepository.findStatusHistories(
                query.appointmentId,
            );

        return histories.map(AppointmentStatusHistoryResponseDto.fromDomain);
    }
}