import { WaitlistEntryAggregate } from '../../domain/waitlist-entry.aggregate';
import { WaitlistEntryStatus } from '../../domain/waitlist-entry-status.enum';

export type ListWaitlistEntriesFilter = {
    clinicId?: string | null;
    doctorId?: string;
    patientId?: string;
    status?: WaitlistEntryStatus;
    from?: Date;
    to?: Date;
    limit?: number;
    offset?: number;
};

export type FindWaitlistCandidatesFilter = {
    clinicId?: string | null;
    doctorId: string;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
    limit?: number;
};

export interface WaitlistEntryRepository {
    save(entry: WaitlistEntryAggregate): Promise<void>;

    findById(id: string): Promise<WaitlistEntryAggregate | null>;

    findActiveDuplicate(params: {
        clinicId?: string | null;
        doctorId: string;
        patientId: string;
        preferredStartAt: Date;
        preferredEndAt: Date;
    }): Promise<WaitlistEntryAggregate | null>;

    findMany(
        filter: ListWaitlistEntriesFilter,
    ): Promise<WaitlistEntryAggregate[]>;

    findCandidatesForSlot(
        filter: FindWaitlistCandidatesFilter,
    ): Promise<WaitlistEntryAggregate[]>;

    findExpiredOffers(params: {
        now: Date;
        limit?: number;
    }): Promise<WaitlistEntryAggregate[]>;
}