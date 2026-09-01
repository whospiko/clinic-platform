import { DoctorWorkingWindow } from './doctor-working-window.entity';
import { DoctorBreakTime } from './doctor-break-time.entity';
import { DoctorScheduleChangedEvent } from './events/doctor-schedule-changed.event';

export type DoctorScheduleTemplateProps = {
    id: string;
    doctorId: string;
    clinicId?: string | null;
    timezone: string;
    effectiveFrom: string;
    effectiveTo?: string | null;
    isActive: boolean;
    workingWindows: DoctorWorkingWindow[];
    breakTimes: DoctorBreakTime[];
};

export class DoctorScheduleTemplate {
    private readonly domainEvents: DoctorScheduleChangedEvent[] = [];

    private constructor(private readonly props: DoctorScheduleTemplateProps) {
        this.validate();
    }

    static create(props: DoctorScheduleTemplateProps): DoctorScheduleTemplate {
        const template = new DoctorScheduleTemplate(props);

        template.addEvent(
            new DoctorScheduleChangedEvent(
                props.doctorId,
                'SCHEDULE_TEMPLATE_CREATED',
            ),
        );

        return template;
    }

    static rehydrate(props: DoctorScheduleTemplateProps): DoctorScheduleTemplate {
        return new DoctorScheduleTemplate(props);
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

    get timezone(): string {
        return this.props.timezone;
    }

    get effectiveFrom(): string {
        return this.props.effectiveFrom;
    }

    get effectiveTo(): string | null | undefined {
        return this.props.effectiveTo;
    }

    get isActive(): boolean {
        return this.props.isActive;
    }

    get workingWindows(): DoctorWorkingWindow[] {
        return [...this.props.workingWindows];
    }

    get breakTimes(): DoctorBreakTime[] {
        return [...this.props.breakTimes];
    }

    addWorkingWindow(window: DoctorWorkingWindow): void {
        const duplicated = this.props.workingWindows.some(
            (item) =>
                item.dayOfWeek === window.dayOfWeek &&
                item.startTime === window.startTime &&
                item.endTime === window.endTime,
        );

        if (duplicated) {
            throw new Error('Duplicated working window');
        }

        this.props.workingWindows.push(window);

        this.addEvent(
            new DoctorScheduleChangedEvent(
                this.props.doctorId,
                'WORKING_WINDOW_ADDED',
            ),
        );
    }

    addBreakTime(breakTime: DoctorBreakTime): void {
        const hasWorkingWindow = this.props.workingWindows.some(
            (window) =>
                window.dayOfWeek === breakTime.dayOfWeek &&
                breakTime.startTime >= window.startTime &&
                breakTime.endTime <= window.endTime,
        );

        if (!hasWorkingWindow) {
            throw new Error('Break time must be inside a working window');
        }

        this.props.breakTimes.push(breakTime);

        this.addEvent(
            new DoctorScheduleChangedEvent(
                this.props.doctorId,
                'BREAK_TIME_ADDED',
            ),
        );
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
            throw new Error('Schedule template id is required');
        }

        if (!this.props.doctorId) {
            throw new Error('doctorId is required');
        }

        if (!this.props.timezone) {
            throw new Error('timezone is required');
        }

        if (!this.props.effectiveFrom) {
            throw new Error('effectiveFrom is required');
        }
    }
}