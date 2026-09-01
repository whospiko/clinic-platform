export class DoctorScheduleChangedEvent {
    constructor(
        public readonly doctorId: string,
        public readonly reason: string,
        public readonly occurredAt: Date = new Date(),
    ) { }
}