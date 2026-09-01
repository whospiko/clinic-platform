import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetDoctorBusySlotsQuery } from '../queries/get-doctor-busy-slots.query';
import {
    APPOINTMENT_QUERY_REPOSITORY,
    AppointmentQueryRepository,
} from '../ports/appointment-query.repository';

import { BusySlotResponseDto } from '../dto/busy-slot-response.dto';

@QueryHandler(GetDoctorBusySlotsQuery)
export class GetDoctorBusySlotsHandler
    implements IQueryHandler<GetDoctorBusySlotsQuery, BusySlotResponseDto[]> {
    constructor(
        @Inject(APPOINTMENT_QUERY_REPOSITORY)
        private readonly appointmentQueryRepository: AppointmentQueryRepository,
    ) { }

    async execute(
        query: GetDoctorBusySlotsQuery,
    ): Promise<BusySlotResponseDto[]> {
        const slots = await this.appointmentQueryRepository.findBusySlotsByDoctor({
            doctorId: query.doctorId,
            from: query.from,
            to: query.to,
        });

        return slots.map(BusySlotResponseDto.fromBusySlot);
    }
}