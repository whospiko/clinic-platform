export class CancelWaitlistEntryCommand {
    constructor(
        public readonly payload: {
            waitlistEntryId: string;
            reason?: string | null;
        },
    ) { }
}