import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
    WAITLIST_APPOINTMENT_HOLD,
    WAITLIST_ENTRY_REPOSITORY,
} from '../../waitlist.tokens';
import { AcceptWaitlistOfferCommand } from '../commands/accept-waitlist-offer.command';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistAppointmentHoldPort } from '../ports/waitlist-appointment-hold.port';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@CommandHandler(AcceptWaitlistOfferCommand)
@Injectable()
export class AcceptWaitlistOfferHandler
    implements ICommandHandler<AcceptWaitlistOfferCommand, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,

        @Inject(WAITLIST_APPOINTMENT_HOLD)
        private readonly appointmentHoldPort: WaitlistAppointmentHoldPort,
    ) { }

    async execute(
        command: AcceptWaitlistOfferCommand,
    ): Promise<WaitlistEntryReadModel> {
        const { waitlistEntryId, patientId } = command.payload;

        const entry = await this.repository.findById(waitlistEntryId);

        if (!entry) {
            throw new NotFoundException('Waitlist entry not found');
        }

        if (entry.patientId !== patientId) {
            throw new ForbiddenException(
                'This patient cannot accept this waitlist offer',
            );
        }

        const snapshot = entry.toSnapshot();

        if (!snapshot.appointmentHoldId) {
            throw new NotFoundException('Appointment hold not found');
        }

        const result = await this.appointmentHoldPort.confirmHold({
            holdId: snapshot.appointmentHoldId,
            patientId,
        });

        entry.acceptOffer({
            appointmentId: result.appointmentId,
        });

        await this.repository.save(entry);

        return entry.toSnapshot();
    }
}