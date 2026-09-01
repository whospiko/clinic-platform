import { ScheduleOverrideType } from '../../domain/schedule-override-type.enum';

export class CreateScheduleOverrideCommand {
    constructor(
        public readonly doctorId: string,
        public readonly clinicId: string | null,
        public readonly date: string,
        public readonly type: ScheduleOverrideType,
        public readonly startTime: string | null,
        public readonly endTime: string | null,
        public readonly reason: string | null,
    ) { }
}