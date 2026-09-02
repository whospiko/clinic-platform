import {
    ConflictException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
    WAITLIST_APPOINTMENT_HOLD,
    WAITLIST_AVAILABILITY_CHECKER,
    WAITLIST_ENTRY_REPOSITORY,
} from '../../waitlist.tokens';
import { OfferWaitlistSlotCommand } from '../commands/offer-waitlist-slot.command';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistAvailabilityCheckerPort } from '../ports/waitlist-availability-checker.port';
import { WaitlistAppointmentHoldPort } from '../ports/waitlist-appointment-hold.port';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@CommandHandler(OfferWaitlistSlotCommand)
@Injectable()
export class OfferWaitlistSlotHandler
    implements ICommandHandler<OfferWaitlistSlotCommand, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,

        @Inject(WAITLIST_AVAILABILITY_CHECKER)
        private readonly availabilityChecker: WaitlistAvailabilityCheckerPort,

        @Inject(WAITLIST_APPOINTMENT_HOLD)
        private readonly appointmentHoldPort: WaitlistAppointmentHoldPort,
    ) { }

    async execute(
        command: OfferWaitlistSlotCommand,
    ): Promise<WaitlistEntryReadModel> {
        const { waitlistEntryId, startAt, endAt, resourceId, ttlMinutes } =
            command.payload;

        const entry = await this.repository.findById(waitlistEntryId);

        if (!entry) {
            throw new NotFoundException('Waitlist entry not found');
        }

        const snapshot = entry.toSnapshot();

        const available = await this.availabilityChecker.isSlotAvailable({
            clinicId: snapshot.clinicId,
            doctorId: snapshot.doctorId,
            resourceId: resourceId ?? snapshot.resourceId,
            startAt,
            endAt,
        });

        if (!available) {
            throw new ConflictException('Selected slot is no longer available');
        }

        const hold = await this.appointmentHoldPort.createHold({
            clinicId: snapshot.clinicId,
            doctorId: snapshot.doctorId,
            patientId: snapshot.patientId,
            resourceId: resourceId ?? snapshot.resourceId,
            startAt,
            endAt,
            ttlMinutes: ttlMinutes ?? 15,
            reason: 'WAITLIST_OFFER',
        });

        entry.offerSlot({
            startAt,
            endAt,
            resourceId: resourceId ?? snapshot.resourceId,
            appointmentHoldId: hold.holdId,
            offerExpiresAt: hold.expiresAt,
        });

        await this.repository.save(entry);

        return entry.toSnapshot();
    }
}