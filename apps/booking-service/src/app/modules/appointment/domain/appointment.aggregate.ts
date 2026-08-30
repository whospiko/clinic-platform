import { randomUUID } from "crypto";
import { AppointmentSource } from "./appointment-source.enum";
import { AppointmentStatusHistoryEntity } from "./appointment-status-history.entity";
import { AppointmentStatus } from "./appointment-status.enum";
import { AppointmentCompletedEvent } from "./events/appointment-completed.event";
import { AppointmentRescheduledEvent } from "./events/appointment-rescheduled.event";
import { AppointmentCancelledEvent } from "./events/appointment-cancelled.event";
import { AppointmentCreatedEvent } from "./events/appointment-created.event";

export type AppointmentDomainEvent =
    | AppointmentCreatedEvent
    | AppointmentCancelledEvent
    | AppointmentRescheduledEvent
    | AppointmentCompletedEvent;

export class AppointmentAggregate {
    private domainEvents: AppointmentDomainEvent[] = [];

    private constructor(
        private readonly id: string,
        private readonly appointmentNo: string,
        private readonly patientId: string,
        private readonly doctorId: string,
        private treatmentId: string | null,
        private source: AppointmentSource,
        private status: AppointmentStatus,
        private startAt: Date,
        private endAt: Date,
        private note: string | null,
        private cancelReason: string | null,
        private readonly createdAt: Date,
        private updatedAt: Date,
        private histories: AppointmentStatusHistoryEntity[],
    ) { }

    static schedule(params: {
        id: string;
        appointmentNo: string;
        patientId: string;
        doctorId: string;
        treatmentId?: string | null;
        source: AppointmentSource;
        startAt: Date;
        endAt: Date;
        note?: string | null;
    }): AppointmentAggregate {
        if (params.endAt <= params.startAt) {
            throw new Error('Appointment end time must be after start time.');
        }

        const now = new Date();

        const appointment = new AppointmentAggregate(
            params.id,
            params.appointmentNo,
            params.patientId,
            params.doctorId,
            params.treatmentId ?? null,
            params.source,
            AppointmentStatus.Requested,
            params.startAt,
            params.endAt,
            params.note ?? null,
            null,
            now,
            now,
            [],
        );

        appointment.addStatusHistory(null, AppointmentStatus.Requested, 'Appointment requested');
        appointment.addEvent(
            new AppointmentCreatedEvent(
                appointment.id,
                appointment.appointmentNo,
                appointment.patientId,
                appointment.doctorId,
                appointment.startAt,
                appointment.endAt,
            ),
        );

        return appointment;
    }

    static rehydrate(params: {
        id: string;
        appointmentNo: string;
        patientId: string;
        doctorId: string;
        treatmentId: string | null;
        source: AppointmentSource;
        status: AppointmentStatus;
        startAt: Date;
        endAt: Date;
        note: string | null;
        cancelReason: string | null;
        createdAt: Date;
        updatedAt: Date;
        histories: AppointmentStatusHistoryEntity[];
    }): AppointmentAggregate {
        return new AppointmentAggregate(
            params.id,
            params.appointmentNo,
            params.patientId,
            params.doctorId,
            params.treatmentId,
            params.source,
            params.status,
            params.startAt,
            params.endAt,
            params.note,
            params.cancelReason,
            params.createdAt,
            params.updatedAt,
            params.histories,
        );
    }

    confirm(): void {
        if (this.status !== AppointmentStatus.Requested) {
            throw new Error('Only requested appointments can be confirmed.');
        }

        this.changeStatus(AppointmentStatus.Confirmed, 'Appointment confirmed');
    }

    cancel(reason: string): void {
        if (this.status === AppointmentStatus.Cancelled) {
            throw new Error('Appointment is already cancelled.');
        }

        if (this.status === AppointmentStatus.Completed) {
            throw new Error('Completed appointment cannot be cancelled.');
        }

        this.cancelReason = reason;
        this.changeStatus(AppointmentStatus.Cancelled, reason);

        this.addEvent(
            new AppointmentCancelledEvent(this.id, reason, new Date()),
        );
    }

    reschedule(params: {
        newStartAt: Date;
        newEndAt: Date;
        treatmentId?: string | null;
        note?: string | null;
    }): void {
        if (this.status === AppointmentStatus.Cancelled) {
            throw new Error('Cancelled appointment cannot be rescheduled.');
        }

        if (this.status === AppointmentStatus.Completed) {
            throw new Error('Completed appointment cannot be rescheduled.');
        }

        if (params.newEndAt <= params.newStartAt) {
            throw new Error('Appointment end time must be after start time.');
        }

        const oldStartAt = this.startAt;
        const oldEndAt = this.endAt;

        this.startAt = params.newStartAt;
        this.endAt = params.newEndAt;

        if (params.treatmentId !== undefined) {
            this.treatmentId = params.treatmentId;
        }

        if (params.note !== undefined) {
            this.note = params.note;
        }

        this.touch();

        this.addEvent(
            new AppointmentRescheduledEvent(
                this.id,
                oldStartAt,
                oldEndAt,
                this.startAt,
                this.endAt,
            ),
        );
    }

    complete(): void {
        if (this.status !== AppointmentStatus.Confirmed) {
            throw new Error('Only confirmed appointments can be completed.');
        }

        this.changeStatus(AppointmentStatus.Completed, 'Appointment completed');

        this.addEvent(
            new AppointmentCompletedEvent(this.id, new Date()),
        );
    }

    pullDomainEvents(): AppointmentDomainEvent[] {
        const events = [...this.domainEvents];
        this.domainEvents = [];
        return events;
    }

    private changeStatus(toStatus: AppointmentStatus, reason: string): void {
        const fromStatus = this.status;
        this.status = toStatus;
        this.addStatusHistory(fromStatus, toStatus, reason);
        this.touch();
    }

    private addStatusHistory(
        fromStatus: AppointmentStatus | null,
        toStatus: AppointmentStatus,
        reason: string,
    ): void {
        this.histories.push(
            AppointmentStatusHistoryEntity.create({
                id: randomUUID(),
                appointmentId: this.id,
                fromStatus,
                toStatus,
                reason,
            }),
        );
    }

    private addEvent(event: AppointmentDomainEvent): void {
        this.domainEvents.push(event);
    }

    private touch(): void {
        this.updatedAt = new Date();
    }

    getId(): string {
        return this.id;
    }

    getAppointmentNo(): string {
        return this.appointmentNo;
    }

    getPatientId(): string {
        return this.patientId;
    }

    getDoctorId(): string {
        return this.doctorId;
    }

    getTreatmentId(): string | null {
        return this.treatmentId;
    }

    getSource(): AppointmentSource {
        return this.source;
    }

    getStatus(): AppointmentStatus {
        return this.status;
    }

    getStartAt(): Date {
        return this.startAt;
    }

    getEndAt(): Date {
        return this.endAt;
    }

    getNote(): string | null {
        return this.note;
    }

    getCancelReason(): string | null {
        return this.cancelReason;
    }

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getHistories(): AppointmentStatusHistoryEntity[] {
        return [...this.histories];
    }
}