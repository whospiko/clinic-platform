import { ScheduleOverrideType } from './schedule-override-type.enum';
import { DoctorScheduleChangedEvent } from './events/doctor-schedule-changed.event';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export type DoctorScheduleOverrideProps = {
    id: string;
    doctorId: string;
    clinicId?: string | null;
    date: string;
    type: ScheduleOverrideType;
    startTime?: string | null;
    endTime?: string | null;
    reason?: string | null;
};

export class DoctorScheduleOverride {
    private readonly domainEvents: DoctorScheduleChangedEvent[] = [];

    private constructor(private readonly props: DoctorScheduleOverrideProps) {
        this.validate();
    }

    static create(props: DoctorScheduleOverrideProps): DoctorScheduleOverride {
        const override = new DoctorScheduleOverride(props);

        override.addEvent(
            new DoctorScheduleChangedEvent(
                props.doctorId,
                'SCHEDULE_OVERRIDE_CREATED',
            ),
        );

        return override;
    }

    static rehydrate(props: DoctorScheduleOverrideProps): DoctorScheduleOverride {
        return new DoctorScheduleOverride(props);
    }

    get id(): string {
        return this.props.id;
    }

    get doctorId(): string {
        return this.props.doctorId;
    }

    get clinicId(): string | null | undefined {
        return this.props.clinicId;
    }

    get date(): string {
        return this.props.date;
    }

    get type(): ScheduleOverrideType {
        return this.props.type;
    }

    get startTime(): string | null | undefined {
        return this.props.startTime;
    }

    get endTime(): string | null | undefined {
        return this.props.endTime;
    }

    get reason(): string | null | undefined {
        return this.props.reason;
    }

    pullEvents(): DoctorScheduleChangedEvent[] {
        const events = [...this.domainEvents];
        this.domainEvents.length = 0;
        return events;
    }

    private addEvent(event: DoctorScheduleChangedEvent): void {
        this.domainEvents.push(event);
    }

    private validate(): void {
        if (!this.props.id) {
            throw new Error('override id is required');
        }

        if (!this.props.doctorId) {
            throw new Error('doctorId is required');
        }

        if (!this.props.date) {
            throw new Error('date is required');
        }

        if (this.props.type !== ScheduleOverrideType.CLOSED_DAY) {
            if (!this.props.startTime || !this.props.endTime) {
                throw new Error('startTime and endTime are required for this override');
            }

            if (!TIME_REGEX.test(this.props.startTime)) {
                throw new Error('override startTime must be HH:mm');
            }

            if (!TIME_REGEX.test(this.props.endTime)) {
                throw new Error('override endTime must be HH:mm');
            }

            if (this.props.startTime >= this.props.endTime) {
                throw new Error('override startTime must be before endTime');
            }
        }
    }
}