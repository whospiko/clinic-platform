import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetAvailableSlotsRequest } from './dto/get-available-slots.request';
import { GetAvailableSlotsQuery } from '../application/queries/get-available-slots.query';
import { AvailableSlotDto } from '../application/dto/available-slot.dto';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
    constructor(private readonly queryBus: QueryBus) { }

    @Get('slots')
    @ApiOperation({
        summary: 'Get available appointment slots for a doctor',
    })
    async getAvailableSlots(
        @Query() request: GetAvailableSlotsRequest,
    ): Promise<AvailableSlotDto[]> {
        return this.queryBus.execute(
            new GetAvailableSlotsQuery(
                request.doctorId,
                request.date,
                request.durationMinutes,
                request.slotStepMinutes,
                request.treatmentId,
            ),
        );
    }
}