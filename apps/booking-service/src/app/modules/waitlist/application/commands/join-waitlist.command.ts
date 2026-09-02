export class JoinWaitlistCommand {
    constructor(
        public readonly payload: {
            clinicId?: string | null;
            doctorId: string;
            patientId: string;
            resourceId?: string | null;
            preferredStartAt: Date;
            preferredEndAt: Date;
            requestedDurationMinutes: number;
            priority?: number;
            reason?: string | null;
        },
    ) { }
}