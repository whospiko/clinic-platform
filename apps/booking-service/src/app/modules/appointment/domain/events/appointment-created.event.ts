export class AppointmentCreatedEvent {
    constructor(
        public readonly appointmentId: string,
        public readonly appointmentNo: string,
        public readonly patientId: string,
        public readonly doctorId: string,
        public readonly startAt: Date,
        public readonly endAt: Date,
    ) { }
}