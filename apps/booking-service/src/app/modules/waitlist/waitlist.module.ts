import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
    WAITLIST_APPOINTMENT_HOLD,
    WAITLIST_AVAILABILITY_CHECKER,
    WAITLIST_ENTRY_REPOSITORY,
} from './waitlist.tokens';

import { WaitlistController } from './presentation/waitlist.controller';

import { WaitlistEntryOrmEntity } from './infrastructure/persistence/waitlist-entry.entity';
import { TypeOrmWaitlistEntryRepository } from './infrastructure/persistence/typeorm-waitlist-entry.repository';

import { DevWaitlistAvailabilityCheckerAdapter } from './infrastructure/adapters/dev-waitlist-availability-checker.adapter';
import { DevWaitlistAppointmentHoldAdapter } from './infrastructure/adapters/dev-waitlist-appointment-hold.adapter';

import { JoinWaitlistHandler } from './application/handlers/join-waitlist.handler';
import { OfferWaitlistSlotHandler } from './application/handlers/offer-waitlist-slot.handler';
import { AcceptWaitlistOfferHandler } from './application/handlers/accept-waitlist-offer.handler';
import { CancelWaitlistEntryHandler } from './application/handlers/cancel-waitlist-entry.handler';
import { ExpireWaitlistOfferHandler } from './application/handlers/expire-waitlist-offer.handler';
import { GetWaitlistEntryHandler } from './application/handlers/get-waitlist-entry.handler';
import { ListWaitlistEntriesHandler } from './application/handlers/list-waitlist-entries.handler';
import { FindWaitlistCandidatesHandler } from './application/handlers/find-waitlist-candidates.handler';

const CommandHandlers = [
    JoinWaitlistHandler,
    OfferWaitlistSlotHandler,
    AcceptWaitlistOfferHandler,
    CancelWaitlistEntryHandler,
    ExpireWaitlistOfferHandler,
];

const QueryHandlers = [
    GetWaitlistEntryHandler,
    ListWaitlistEntriesHandler,
    FindWaitlistCandidatesHandler,
];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([WaitlistEntryOrmEntity]),
    ],
    controllers: [WaitlistController],
    providers: [
        ...CommandHandlers,
        ...QueryHandlers,

        {
            provide: WAITLIST_ENTRY_REPOSITORY,
            useClass: TypeOrmWaitlistEntryRepository,
        },

        /**
         * Replace this with real adapter later:
         * AvailabilityModule / AvailabilityCheckerPort
         */
        {
            provide: WAITLIST_AVAILABILITY_CHECKER,
            useClass: DevWaitlistAvailabilityCheckerAdapter,
        },

        /**
         * Replace this with real adapter later:
         * HoldModule / AppointmentHoldPort
         */
        {
            provide: WAITLIST_APPOINTMENT_HOLD,
            useClass: DevWaitlistAppointmentHoldAdapter,
        },
    ],
    exports: [
        WAITLIST_ENTRY_REPOSITORY,
    ],
})
export class WaitlistModule { }