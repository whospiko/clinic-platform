import { WaitlistEntryStatus } from '../../domain/waitlist-entry-status.enum';

export class ListWaitlistEntriesQuery {
    constructor(
        public readonly filter: {
            clinicId?: string | null;
            doctorId?: string;
            patientId?: string;
            status?: WaitlistEntryStatus;
            from?: Date;
            to?: Date;
            limit?: number;
            offset?: number;
        },
    ) { }
}