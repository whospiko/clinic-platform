const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DoctorWorkingWindowProps = {
    id: string;
    templateId?: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
    capacity: number;
};

export class DoctorWorkingWindow {
    private constructor(private readonly props: DoctorWorkingWindowProps) {
        this.validate();
    }

    static create(props: DoctorWorkingWindowProps): DoctorWorkingWindow {
        return new DoctorWorkingWindow(props);
    }

    get id(): string {
        return this.props.id;
    }

    get templateId(): string | null | undefined {
        return this.props.templateId;
    }

    get dayOfWeek(): number {
        return this.props.dayOfWeek;
    }

    get startTime(): string {
        return this.props.startTime;
    }

    get endTime(): string {
        return this.props.endTime;
    }

    get slotDurationMinutes(): number {
        return this.props.slotDurationMinutes;
    }

    get capacity(): number {
        return this.props.capacity;
    }

    private validate(): void {
        if (this.props.dayOfWeek < 1 || this.props.dayOfWeek > 7) {
            throw new Error('dayOfWeek must be between 1 and 7');
        }

        if (!TIME_REGEX.test(this.props.startTime)) {
            throw new Error('startTime must be in HH:mm format');
        }

        if (!TIME_REGEX.test(this.props.endTime)) {
            throw new Error('endTime must be in HH:mm format');
        }

        if (this.props.startTime >= this.props.endTime) {
            throw new Error('working window startTime must be before endTime');
        }

        if (this.props.slotDurationMinutes <= 0) {
            throw new Error('slotDurationMinutes must be greater than 0');
        }

        if (this.props.capacity <= 0) {
            throw new Error('capacity must be greater than 0');
        }
    }
}