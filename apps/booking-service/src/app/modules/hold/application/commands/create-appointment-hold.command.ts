export class CreateAppointmentHoldCommand {
    constructor(
        public readonly props: {
            clinicId?: string | null;
            doctorId: string;
            patientId?: string | null;
            resourceId?: string | null;
            startAt: string;
            endAt: string;
            ttlSeconds?: number;
            reason?: string | null;
        },
    ) { }
}