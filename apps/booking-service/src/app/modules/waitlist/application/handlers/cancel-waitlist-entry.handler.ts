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
import { CancelWaitlistEntryCommand } from '../commands/cancel-waitlist-entry.command';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistAppointmentHoldPort } from '../ports/waitlist-appointment-hold.port';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@CommandHandler(CancelWaitlistEntryCommand)
@Injectable()
export class CancelWaitlistEntryHandler
    implements ICommandHandler<CancelWaitlistEntryCommand, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,

        @Inject(WAITLIST_APPOINTMENT_HOLD)
        private readonly appointmentHoldPort: WaitlistAppointmentHoldPort,
    ) { }

    async execute(
        command: CancelWaitlistEntryCommand,
    ): Promise<WaitlistEntryReadModel> {
        const { waitlistEntryId, reason } = command.payload;

        const entry = await this.repository.findById(waitlistEntryId);

        if (!entry) {
            throw new NotFoundException('Waitlist entry not found');
        }

        const snapshot = entry.toSnapshot();

        if (snapshot.appointmentHoldId) {
            await this.appointmentHoldPort.cancelHold(snapshot.appointmentHoldId);
        }

        entry.cancel({
            reason,
        });

        await this.repository.save(entry);

        return entry.toSnapshot();
    }
}