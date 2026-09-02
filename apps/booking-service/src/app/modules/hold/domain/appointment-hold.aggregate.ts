import { AppointmentHoldStatus } from './appointment-hold-status.enum';

export type AppointmentHoldProps = {
    id: string;
    clinicId?: string | null;
    doctorId: string;
    patientId?: string | null;
    resourceId?: string | null;

    /**
     * When this hold becomes a real appointment, appointmentId can be attached.
     * Keep it nullable because the hold is created before appointment confirmation.
     */
    appointmentId?: string | null;

    startAt: Date;
    endAt: Date;
    expiresAt: Date;

    status: AppointmentHoldStatus;

    reason?: string | null;

    createdAt: Date;
    updatedAt: Date;
};

export type CreateAppointmentHoldProps = {
    id: string;
    clinicId?: string | null;
    doctorId: string;
    patientId?: string | null;
    resourceId?: string | null;
    startAt: Date;
    endAt: Date;
    expiresAt: Date;
    reason?: string | null;
    now?: Date;
};

export class AppointmentHoldAggregate {
    private constructor(private readonly props: AppointmentHoldProps) { }

    static create(props: CreateAppointmentHoldProps): AppointmentHoldAggregate {
        const now = props.now ?? new Date();

        if (props.endAt <= props.startAt) {
            throw new Error('Hold end time must be after start time.');
        }

        if (props.expiresAt <= now) {
            throw new Error('Hold expiration time must be in the future.');
        }

        return new AppointmentHoldAggregate({
            id: props.id,
            clinicId: props.clinicId ?? null,
            doctorId: props.doctorId,
            patientId: props.patientId ?? null,
            resourceId: props.resourceId ?? null,
            appointmentId: null,
            startAt: props.startAt,
            endAt: props.endAt,
            expiresAt: props.expiresAt,
            status: AppointmentHoldStatus.ACTIVE,
            reason: props.reason ?? null,
            createdAt: now,
            updatedAt: now,
        });
    }

    static rehydrate(props: AppointmentHoldProps): AppointmentHoldAggregate {
        return new AppointmentHoldAggregate(props);
    }

    confirm(appointmentId: string, now = new Date()): void {
        if (this.props.status !== AppointmentHoldStatus.ACTIVE) {
            throw new Error(`Only ACTIVE hold can be confirmed. Current status: ${this.props.status}`);
        }

        if (this.props.expiresAt <= now) {
            throw new Error('Cannot confirm an expired hold.');
        }

        this.props.appointmentId = appointmentId;
        this.props.status = AppointmentHoldStatus.CONFIRMED;
        this.props.updatedAt = now;
    }

    cancel(now = new Date()): void {
        if (this.props.status === AppointmentHoldStatus.CONFIRMED) {
            throw new Error('Confirmed hold cannot be cancelled. Cancel the appointment instead.');
        }

        if (
            this.props.status === AppointmentHoldStatus.CANCELLED ||
            this.props.status === AppointmentHoldStatus.EXPIRED
        ) {
            return;
        }

        this.props.status = AppointmentHoldStatus.CANCELLED;
        this.props.updatedAt = now;
    }

    expire(now = new Date()): void {
        if (this.props.status !== AppointmentHoldStatus.ACTIVE) {
            return;
        }

        if (this.props.expiresAt > now) {
            throw new Error('Hold is not expired yet.');
        }

        this.props.status = AppointmentHoldStatus.EXPIRED;
        this.props.updatedAt = now;
    }

    isActiveAt(now = new Date()): boolean {
        return this.props.status === AppointmentHoldStatus.ACTIVE && this.props.expiresAt > now;
    }

    get id(): string {
        return this.props.id;
    }

    get clinicId(): string | null | undefined {
        return this.props.clinicId;
    }

    get doctorId(): string {
        return this.props.doctorId;
    }

    get patientId(): string | null | undefined {
        return this.props.patientId;
    }

    get resourceId(): string | null | undefined {
        return this.props.resourceId;
    }

    get appointmentId(): string | null | undefined {
        return this.props.appointmentId;
    }

    get startAt(): Date {
        return this.props.startAt;
    }

    get endAt(): Date {
        return this.props.endAt;
    }

    get expiresAt(): Date {
        return this.props.expiresAt;
    }

    get status(): AppointmentHoldStatus {
        return this.props.status;
    }

    get reason(): string | null | undefined {
        return this.props.reason;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date {
        return this.props.updatedAt;
    }

    toPrimitives(): AppointmentHoldProps {
        return {
            ...this.props,
        };
    }
}