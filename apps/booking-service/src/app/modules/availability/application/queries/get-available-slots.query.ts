export class GetAvailableSlotsQuery {
    constructor(
        public readonly doctorId: string,
        public readonly date: string,
        public readonly durationMinutes?: number,
        public readonly slotStepMinutes?: number,
        public readonly treatmentId?: string,
    ) { }
}