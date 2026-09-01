import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { AvailabilityDomainService } from './domain/availability-domain.service';
import { GetAvailableSlotsHandler } from './application/handlers/get-available-slots.handler';

import {
    AVAILABILITY_CHECKER_PORT,
} from './application/ports/availability-checker.port';
import {
    SCHEDULE_READER_PORT,
} from './application/ports/schedule-reader.port';
import {
    APPOINTMENT_BLOCK_READER_PORT,
} from './application/ports/appointment-block-reader.port';
import {
    HOLD_BLOCK_READER_PORT,
} from './application/ports/hold-block-reader.port';
import {
    RESOURCE_READER_PORT,
} from './application/ports/resource-reader.port';

import { AvailabilityCheckerAdapter } from './infrastructure/adapters/availability-checker.adapter';
import { FakeScheduleReaderAdapter } from './infrastructure/adapters/fake/fake-schedule-reader.adapter';
import { FakeAppointmentBlockReaderAdapter } from './infrastructure/adapters/fake/fake-appointment-block-reader.adapter';
import { FakeHoldBlockReaderAdapter } from './infrastructure/adapters/fake/fake-hold-block-reader.adapter';
import { FakeResourceReaderAdapter } from './infrastructure/adapters/fake/fake-resource-reader.adapter';

import { AvailabilityController } from './persentation/availability.controller';

@Module({
    imports: [CqrsModule],
    controllers: [AvailabilityController],
    providers: [
        AvailabilityDomainService,

        {
            provide: AVAILABILITY_CHECKER_PORT,
            useClass: AvailabilityCheckerAdapter,
        },
        {
            provide: SCHEDULE_READER_PORT,
            useClass: FakeScheduleReaderAdapter,
        },
        {
            provide: APPOINTMENT_BLOCK_READER_PORT,
            useClass: FakeAppointmentBlockReaderAdapter,
        },
        {
            provide: HOLD_BLOCK_READER_PORT,
            useClass: FakeHoldBlockReaderAdapter,
        },
        {
            provide: RESOURCE_READER_PORT,
            useClass: FakeResourceReaderAdapter,
        },

        GetAvailableSlotsHandler,
    ],
    exports: [AVAILABILITY_CHECKER_PORT],
})
export class AvailabilityModule { }