import { AppointmentSource } from "../../domain/appointment-source.enum";

export class CreateAppointmentCommand {
    constructor(
        public readonly patientId: string,
        public readonly doctorId: string,
        public readonly treatmentId: string | null,
        public readonly startAt: Date,
        public readonly endAt: Date | null,
        public readonly source: AppointmentSource,
        public readonly note: string | null,
    ) { }
}