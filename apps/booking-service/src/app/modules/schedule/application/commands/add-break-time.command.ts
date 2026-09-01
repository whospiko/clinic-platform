export class AddBreakTimeCommand {
    constructor(
        public readonly templateId: string,
        public readonly dayOfWeek: number,
        public readonly startTime: string,
        public readonly endTime: string,
        public readonly reason: string | null,
    ) { }
}