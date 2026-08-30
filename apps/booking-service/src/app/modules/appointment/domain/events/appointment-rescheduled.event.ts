export class AppointmentRescheduledEvent {
    constructor(
        public readonly appointmentId: string,
        public readonly oldStartAt: Date,
        public readonly oldEndAt: Date,
        public readonly newStartAt: Date,
        public readonly newEndAt: Date,
    ) { }
}