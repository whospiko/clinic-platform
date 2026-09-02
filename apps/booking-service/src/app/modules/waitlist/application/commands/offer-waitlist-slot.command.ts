export class OfferWaitlistSlotCommand {
    constructor(
        public readonly payload: {
            waitlistEntryId: string;
            startAt: Date;
            endAt: Date;
            resourceId?: string | null;
            ttlMinutes?: number;
        },
    ) { }
}