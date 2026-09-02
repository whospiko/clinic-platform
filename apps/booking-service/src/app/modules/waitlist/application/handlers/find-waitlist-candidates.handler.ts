import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WAITLIST_ENTRY_REPOSITORY } from '../../waitlist.tokens';
import { FindWaitlistCandidatesQuery } from '../queries/find-waitlist-candidates.query';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@QueryHandler(FindWaitlistCandidatesQuery)
@Injectable()
export class FindWaitlistCandidatesHandler
    implements IQueryHandler<FindWaitlistCandidatesQuery, WaitlistEntryReadModel[]> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,
    ) { }

    async execute(
        query: FindWaitlistCandidatesQuery,
    ): Promise<WaitlistEntryReadModel[]> {
        const entries = await this.repository.findCandidatesForSlot(query.filter);

        return entries.map((entry) => entry.toSnapshot());
    }
}