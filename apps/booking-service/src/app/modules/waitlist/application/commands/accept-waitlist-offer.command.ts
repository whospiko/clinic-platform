export class AcceptWaitlistOfferCommand {
    constructor(
        public readonly payload: {
            waitlistEntryId: string;
            patientId: string;
        },
    ) { }
}