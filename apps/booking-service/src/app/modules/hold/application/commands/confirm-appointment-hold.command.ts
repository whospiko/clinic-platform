export class ConfirmAppointmentHoldCommand {
    constructor(
        public readonly holdId: string,
        public readonly appointmentId: string,
    ) { }
}