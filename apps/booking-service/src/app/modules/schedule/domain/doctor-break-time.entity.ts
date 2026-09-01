const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DoctorBreakTimeProps = {
    id: string;
    templateId?: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    reason?: string | null;
};

export class DoctorBreakTime {
    private constructor(private readonly props: DoctorBreakTimeProps) {
        this.validate();
    }

    static create(props: DoctorBreakTimeProps): DoctorBreakTime {
        return new DoctorBreakTime(props);
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

    get reason(): string | null | undefined {
        return this.props.reason;
    }

    private validate(): void {
        if (this.props.dayOfWeek < 1 || this.props.dayOfWeek > 7) {
            throw new Error('dayOfWeek must be between 1 and 7');
        }

        if (!TIME_REGEX.test(this.props.startTime)) {
            throw new Error('break startTime must be in HH:mm format');
        }

        if (!TIME_REGEX.test(this.props.endTime)) {
            throw new Error('break endTime must be in HH:mm format');
        }

        if (this.props.startTime >= this.props.endTime) {
            throw new Error('break startTime must be before endTime');
        }
    }
}