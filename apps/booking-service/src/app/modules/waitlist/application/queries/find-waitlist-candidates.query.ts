export class FindWaitlistCandidatesQuery {
    constructor(
        public readonly filter: {
            clinicId?: string | null;
            doctorId: string;
            resourceId?: string | null;
            startAt: Date;
            endAt: Date;
            limit?: number;
        },
    ) { }
}