export class RescheduleAppointmentCommand {
    constructor(
        public readonly appointmentId: string,
        public readonly startAt: Date,
        public readonly endAt: Date | null,
        public readonly treatmentId: string | null,
        public readonly note: string | null,
    ) { }
}