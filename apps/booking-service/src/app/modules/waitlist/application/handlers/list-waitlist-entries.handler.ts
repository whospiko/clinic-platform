import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WAITLIST_ENTRY_REPOSITORY } from '../../waitlist.tokens';
import { ListWaitlistEntriesQuery } from '../queries/list-waitlist-entries.query';
import { WaitlistEntryRepository } from '../ports/waitlist-entry.repository';
import { WaitlistEntryReadModel } from '../dto/waitlist-entry-read-model';

@QueryHandler(ListWaitlistEntriesQuery)
@Injectable()
export class ListWaitlistEntriesHandler
    implements IQueryHandler<ListWaitlistEntriesQuery, WaitlistEntryReadModel[]> {
    constructor(
        @Inject(WAITLIST_ENTRY_REPOSITORY)
        private readonly repository: WaitlistEntryRepository,
    ) { }

    async execute(
        query: ListWaitlistEntriesQuery,
    ): Promise<WaitlistEntryReadModel[]> {
        const entries = await this.repository.findMany(query.filter);

        return entries.map((entry) => entry.toSnapshot());
    }
}