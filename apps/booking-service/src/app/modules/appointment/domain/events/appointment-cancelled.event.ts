export class AppointmentCancelledEvent {
    constructor(
        public readonly appointmentId: string,
        public readonly reason: string,
        public readonly cancelledAt: Date,
    ) { }
}