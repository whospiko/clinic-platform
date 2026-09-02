import {
    ConflictException,
    Inject,
    Injectable,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';

import { WAITLIST_ENTRY_REPOSITORY } from '../../waitlist.tokens';
import { WaitlistEntryAggregate } from '../../domain/waitlist-entry.aggregate';
import { JoinWaitlistCommand } from '../commands/join-waitlist.command';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@CommandHandler(JoinWaitlistCommand)
@Injectable()
export class JoinWaitlistHandler
    implements ICommandHandler<JoinWaitlistCommand, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,
    ) { }

    async execute(
        command: JoinWaitlistCommand,
    ): Promise<WaitlistEntryReadModel> {
        const payload = command.payload;

        const duplicate = await this.repository.findActiveDuplicate({
            clinicId: payload.clinicId ?? null,
            doctorId: payload.doctorId,
            patientId: payload.patientId,
            preferredStartAt: payload.preferredStartAt,
            preferredEndAt: payload.preferredEndAt,
        });

        if (duplicate) {
            throw new ConflictException(
                'Patient already has an active waitlist entry for this doctor and preferred time range',
            );
        }

        const entry = WaitlistEntryAggregate.create({
            id: randomUUID(),
            ...payload,
        });

        await this.repository.save(entry);

        return entry.toSnapshot();
    }
}