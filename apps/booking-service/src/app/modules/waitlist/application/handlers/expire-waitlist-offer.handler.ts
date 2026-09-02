import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
    WAITLIST_APPOINTMENT_HOLD,
    WAITLIST_ENTRY_REPOSITORY,
} from '../../waitlist.tokens';
import { ExpireWaitlistOfferCommand } from '../commands/expire-waitlist-offer.command';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistAppointmentHoldPort } from '../ports/waitlist-appointment-hold.port';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@CommandHandler(ExpireWaitlistOfferCommand)
@Injectable()
export class ExpireWaitlistOfferHandler
    implements ICommandHandler<ExpireWaitlistOfferCommand, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,

        @Inject(WAITLIST_APPOINTMENT_HOLD)
        private readonly appointmentHoldPort: WaitlistAppointmentHoldPort,
    ) { }

    async execute(
        command: ExpireWaitlistOfferCommand,
    ): Promise<WaitlistEntryReadModel> {
        const entry = await this.repository.findById(
            command.payload.waitlistEntryId,
        );

        if (!entry) {
            throw new NotFoundException('Waitlist entry not found');
        }

        const snapshot = entry.toSnapshot();

        if (snapshot.appointmentHoldId) {
            await this.appointmentHoldPort.cancelHold(snapshot.appointmentHoldId);
        }

        entry.expireOffer();

        await this.repository.save(entry);

        return entry.toSnapshot();
    }
}