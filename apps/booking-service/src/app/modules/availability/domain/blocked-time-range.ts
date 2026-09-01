export type BlockedTimeReason =
    | 'BREAK'
    | 'APPOINTMENT'
    | 'HOLD'
    | 'SCHEDULE_OVERRIDE'
    | 'RESOURCE_UNAVAILABLE';

export class BlockedTimeRange {
    private constructor(
        public readonly startAt: Date,
        public readonly endAt: Date,
        public readonly reason: BlockedTimeReason,
    ) { }

    static create(params: {
        startAt: Date;
        endAt: Date;
        reason: BlockedTimeReason;
    }): BlockedTimeRange {
        if (params.startAt >= params.endAt) {
            throw new Error('Blocked range startAt must be before endAt');
        }

        return new BlockedTimeRange(params.startAt, params.endAt, params.reason);
    }

    overlaps(startAt: Date, endAt: Date): boolean {
        return this.startAt < endAt && this.endAt > startAt;
    }
}