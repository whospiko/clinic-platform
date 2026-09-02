import { WaitlistEntryStatus } from './waitlist-entry-status.enum';

export type WaitlistEntrySnapshot = {
    id: string;
    clinicId: string | null;
    doctorId: string;
    patientId: string;
    resourceId: string | null;

    preferredStartAt: Date;
    preferredEndAt: Date;
    requestedDurationMinutes: number;

    status: WaitlistEntryStatus;
    priority: number;
    reason: string | null;

    offeredStartAt: Date | null;
    offeredEndAt: Date | null;
    offeredResourceId: string | null;
    appointmentHoldId: string | null;
    offerExpiresAt: Date | null;

    bookedAppointmentId: string | null;

    cancelledReason: string | null;
    cancelledAt: Date | null;

    createdAt: Date;
    updatedAt: Date;
};

export class WaitlistEntryAggregate {
    private constructor(private readonly props: WaitlistEntrySnapshot) { }

    static create(params: {
        id: string;
        clinicId?: string | null;
        doctorId: string;
        patientId: string;
        resourceId?: string | null;
        preferredStartAt: Date;
        preferredEndAt: Date;
        requestedDurationMinutes: number;
        priority?: number;
        reason?: string | null;
        now?: Date;
    }): WaitlistEntryAggregate {
        const now = params.now ?? new Date();

        if (!params.doctorId) {
            throw new Error('doctorId is required');
        }

        if (!params.patientId) {
            throw new Error('patientId is required');
        }

        if (params.preferredEndAt <= params.preferredStartAt) {
            throw new Error('preferredEndAt must be after preferredStartAt');
        }

        if (params.requestedDurationMinutes <= 0) {
            throw new Error('requestedDurationMinutes must be greater than 0');
        }

        return new WaitlistEntryAggregate({
            id: params.id,
            clinicId: params.clinicId ?? null,
            doctorId: params.doctorId,
            patientId: params.patientId,
            resourceId: params.resourceId ?? null,

            preferredStartAt: params.preferredStartAt,
            preferredEndAt: params.preferredEndAt,
            requestedDurationMinutes: params.requestedDurationMinutes,

            status: WaitlistEntryStatus.WAITING,
            priority: params.priority ?? 0,
            reason: params.reason ?? null,

            offeredStartAt: null,
            offeredEndAt: null,
            offeredResourceId: null,
            appointmentHoldId: null,
            offerExpiresAt: null,

            bookedAppointmentId: null,

            cancelledReason: null,
            cancelledAt: null,

            createdAt: now,
            updatedAt: now,
        });
    }

    static fromSnapshot(snapshot: WaitlistEntrySnapshot): WaitlistEntryAggregate {
        return new WaitlistEntryAggregate(snapshot);
    }

    get id(): string {
        return this.props.id;
    }

    get status(): WaitlistEntryStatus {
        return this.props.status;
    }

    get patientId(): string {
        return this.props.patientId;
    }

    get doctorId(): string {
        return this.props.doctorId;
    }

    get appointmentHoldId(): string | null {
        return this.props.appointmentHoldId;
    }

    get offerExpiresAt(): Date | null {
        return this.props.offerExpiresAt;
    }

    isActive(): boolean {
        return [
            WaitlistEntryStatus.WAITING,
            WaitlistEntryStatus.OFFERED,
        ].includes(this.props.status);
    }

    offerSlot(params: {
        startAt: Date;
        endAt: Date;
        resourceId?: string | null;
        appointmentHoldId: string;
        offerExpiresAt: Date;
        now?: Date;
    }): void {
        const now = params.now ?? new Date();

        if (this.props.status !== WaitlistEntryStatus.WAITING) {
            throw new Error('Only WAITING waitlist entries can be offered');
        }

        if (params.endAt <= params.startAt) {
            throw new Error('Offer endAt must be after startAt');
        }

        if (params.startAt < this.props.preferredStartAt) {
            throw new Error('Offer startAt is before preferredStartAt');
        }

        if (params.endAt > this.props.preferredEndAt) {
            throw new Error('Offer endAt is after preferredEndAt');
        }

        if (params.offerExpiresAt <= now) {
            throw new Error('offerExpiresAt must be in the future');
        }

        const offeredMinutes =
            (params.endAt.getTime() - params.startAt.getTime()) / 60_000;

        if (offeredMinutes < this.props.requestedDurationMinutes) {
            throw new Error(
                'Offered slot is shorter than requestedDurationMinutes',
            );
        }

        this.props.status = WaitlistEntryStatus.OFFERED;
        this.props.offeredStartAt = params.startAt;
        this.props.offeredEndAt = params.endAt;
        this.props.offeredResourceId = params.resourceId ?? null;
        this.props.appointmentHoldId = params.appointmentHoldId;
        this.props.offerExpiresAt = params.offerExpiresAt;
        this.props.updatedAt = now;
    }

    acceptOffer(params: {
        appointmentId: string;
        now?: Date;
    }): void {
        const now = params.now ?? new Date();

        if (this.props.status !== WaitlistEntryStatus.OFFERED) {
            throw new Error('Only OFFERED waitlist entries can be accepted');
        }

        if (!this.props.appointmentHoldId) {
            throw new Error('Waitlist offer does not have an appointment hold');
        }

        if (this.props.offerExpiresAt && this.props.offerExpiresAt <= now) {
            throw new Error('Waitlist offer has expired');
        }

        this.props.status = WaitlistEntryStatus.BOOKED;
        this.props.bookedAppointmentId = params.appointmentId;
        this.props.updatedAt = now;
    }

    cancel(params: {
        reason?: string | null;
        now?: Date;
    }): void {
        const now = params.now ?? new Date();

        if (
            [
                WaitlistEntryStatus.BOOKED,
                WaitlistEntryStatus.CANCELLED,
                WaitlistEntryStatus.EXPIRED,
            ].includes(this.props.status)
        ) {
            throw new Error(`Cannot cancel waitlist entry in ${this.props.status}`);
        }

        this.props.status = WaitlistEntryStatus.CANCELLED;
        this.props.cancelledReason = params.reason ?? null;
        this.props.cancelledAt = now;
        this.props.updatedAt = now;
    }

    expireOffer(params?: { now?: Date }): void {
        const now = params?.now ?? new Date();

        if (this.props.status !== WaitlistEntryStatus.OFFERED) {
            throw new Error('Only OFFERED waitlist entries can expire offer');
        }

        if (this.props.offerExpiresAt && this.props.offerExpiresAt > now) {
            throw new Error('Offer is not expired yet');
        }

        this.props.status = WaitlistEntryStatus.WAITING;
        this.props.offeredStartAt = null;
        this.props.offeredEndAt = null;
        this.props.offeredResourceId = null;
        this.props.appointmentHoldId = null;
        this.props.offerExpiresAt = null;
        this.props.updatedAt = now;
    }

    expireEntry(params?: { now?: Date }): void {
        const now = params?.now ?? new Date();

        if (
            [
                WaitlistEntryStatus.BOOKED,
                WaitlistEntryStatus.CANCELLED,
                WaitlistEntryStatus.EXPIRED,
            ].includes(this.props.status)
        ) {
            return;
        }

        this.props.status = WaitlistEntryStatus.EXPIRED;
        this.props.updatedAt = now;
    }

    toSnapshot(): WaitlistEntrySnapshot {
        return { ...this.props };
    }
}