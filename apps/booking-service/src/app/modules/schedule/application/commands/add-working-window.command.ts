export class AddWorkingWindowCommand {
    constructor(
        public readonly templateId: string,
        public readonly dayOfWeek: number,
        public readonly startTime: string,
        public readonly endTime: string,
        public readonly slotDurationMinutes: number,
        public readonly capacity: number,
    ) { }
}