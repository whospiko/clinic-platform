export class ExpireWaitlistOfferCommand {
    constructor(
        public readonly payload: {
            waitlistEntryId: string;
        },
    ) { }
}