import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { GetAvailableSlotsQuery } from '../queries/get-available-slots.query';
import {
    AVAILABILITY_CHECKER_PORT,
    AvailabilityCheckerPort,
} from '../ports/availability-checker.port';
import { AvailableSlotDto } from '../dto/available-slot.dto';

@QueryHandler(GetAvailableSlotsQuery)
export class GetAvailableSlotsHandler
    implements IQueryHandler<GetAvailableSlotsQuery, AvailableSlotDto[]> {
    constructor(
        @Inject(AVAILABILITY_CHECKER_PORT)
        private readonly availabilityChecker: AvailabilityCheckerPort,
    ) { }

    async execute(query: GetAvailableSlotsQuery): Promise<AvailableSlotDto[]> {
        return this.availabilityChecker.getAvailableSlots({
            doctorId: query.doctorId,
            date: query.date,
            durationMinutes: query.durationMinutes,
            slotStepMinutes: query.slotStepMinutes,
            treatmentId: query.treatmentId,
        });
    }
}