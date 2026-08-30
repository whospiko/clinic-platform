export class AppointmentCompletedEvent {
    constructor(
        public readonly appointmentId: string,
        public readonly completedAt: Date,
    ) { }
}