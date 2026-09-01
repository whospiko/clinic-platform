export class AvailabilitySlot {
    private constructor(
        public readonly doctorId: string,
        public readonly startAt: Date,
        public readonly endAt: Date,
    ) { }

    static create(params: {
        doctorId: string;
        startAt: Date;
        endAt: Date;
    }): AvailabilitySlot {
        if (!params.doctorId) {
            throw new Error('doctorId is required');
        }

        if (params.startAt >= params.endAt) {
            throw new Error('Availability slot startAt must be before endAt');
        }

        return new AvailabilitySlot(params.doctorId, params.startAt, params.endAt);
    }

    durationMinutes(): number {
        return Math.floor(
            (this.endAt.getTime() - this.startAt.getTime()) / 60_000,
        );
    }
}