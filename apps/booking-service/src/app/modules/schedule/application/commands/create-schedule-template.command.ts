export class CreateScheduleTemplateCommand {
    constructor(
        public readonly doctorId: string,
        public readonly clinicId: string | null,
        public readonly timezone: string,
        public readonly effectiveFrom: string,
        public readonly effectiveTo: string | null,
    ) { }
}