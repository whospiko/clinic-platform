export class CheckDoctorAvailabilityQuery {
    constructor(
        public readonly doctorId: string,
        public readonly startAt: Date,
        public readonly endAt: Date,
        public readonly excludeAppointmentId?: string,
    ) { }
}