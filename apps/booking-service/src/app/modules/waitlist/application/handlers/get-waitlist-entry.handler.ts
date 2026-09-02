import {
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WAITLIST_ENTRY_REPOSITORY } from '../../waitlist.tokens';
import { GetWaitlistEntryQuery } from '../queries/get-waitlist-entry.query';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@QueryHandler(GetWaitlistEntryQuery)
@Injectable()
export class GetWaitlistEntryHandler
    implements IQueryHandler<GetWaitlistEntryQuery, WaitlistEntryReadModel> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,
    ) { }

    async execute(
        query: GetWaitlistEntryQuery,
    ): Promise<WaitlistEntryReadModel> {
        const entry = await this.repository.findById(query.id);

        if (!entry) {
            throw new NotFoundException('Waitlist entry not found');
        }

        return entry.toSnapshot();
    }
}