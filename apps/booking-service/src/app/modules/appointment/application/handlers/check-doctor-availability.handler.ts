import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CheckDoctorAvailabilityQuery } from '../queries/check-doctor-availability.query';
import {
    AVAILABILITY_CHECKER,
    AvailabilityCheckerPort,
} from '../ports/availability-checker.port';

import { AvailabilityResponseDto } from '../dto/availability-response.dto';

@QueryHandler(CheckDoctorAvailabilityQuery)
export class CheckDoctorAvailabilityHandler
    implements IQueryHandler<CheckDoctorAvailabilityQuery, AvailabilityResponseDto> {
    constructor(
        @Inject(AVAILABILITY_CHECKER)
        private readonly availabilityChecker: AvailabilityCheckerPort,
    ) { }

    async execute(
        query: CheckDoctorAvailabilityQuery,
    ): Promise<AvailabilityResponseDto> {
        const available = await this.availabilityChecker.isDoctorAvailable({
            doctorId: query.doctorId,
            startAt: query.startAt,
            endAt: query.endAt,
            excludeAppointmentId: query.excludeAppointmentId,
        });

        return { available };
    }
}