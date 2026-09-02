import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { WaitlistEntryStatus } from '../../domain/waitlist-entry-status.enum';

@Entity('waitlist_entries')
@Index('idx_waitlist_entries_status_doctor_range', [
    'status',
    'doctorId',
    'preferredStartAt',
    'preferredEndAt',
])
@Index('idx_waitlist_entries_patient_status', ['patientId', 'status'])
@Index('idx_waitlist_entries_offer_expiry', ['status', 'offerExpiresAt'])
export class WaitlistEntryOrmEntity {
    @PrimaryColumn({
        type: 'varchar',
        length: 36,
    })
    id!: string;

    @Column({
        name: 'clinic_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    clinicId!: string | null;

    @Column({
        name: 'doctor_id',
        type: 'varchar',
        length: 36,
    })
    doctorId!: string;

    @Column({
        name: 'patient_id',
        type: 'varchar',
        length: 36,
    })
    patientId!: string;

    @Column({
        name: 'resource_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    resourceId!: string | null;

    @Column({
        name: 'preferred_start_at',
        type: 'datetime',
        precision: 6,
    })
    preferredStartAt!: Date;

    @Column({
        name: 'preferred_end_at',
        type: 'datetime',
        precision: 6,
    })
    preferredEndAt!: Date;

    @Column({
        name: 'requested_duration_minutes',
        type: 'int',
    })
    requestedDurationMinutes!: number;

    @Column({
        type: 'varchar',
        length: 30,
    })
    status!: WaitlistEntryStatus;

    @Column({
        type: 'int',
        default: 0,
    })
    priority!: number;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    reason!: string | null;

    @Column({
        name: 'offered_start_at',
        type: 'datetime',
        precision: 6,
        nullable: true,
    })
    offeredStartAt!: Date | null;

    @Column({
        name: 'offered_end_at',
        type: 'datetime',
        precision: 6,
        nullable: true,
    })
    offeredEndAt!: Date | null;

    @Column({
        name: 'offered_resource_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    offeredResourceId!: string | null;

    @Column({
        name: 'appointment_hold_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    appointmentHoldId!: string | null;

    @Column({
        name: 'offer_expires_at',
        type: 'datetime',
        precision: 6,
        nullable: true,
    })
    offerExpiresAt!: Date | null;

    @Column({
        name: 'booked_appointment_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    bookedAppointmentId!: string | null;

    @Column({
        name: 'cancelled_reason',
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    cancelledReason!: string | null;

    @Column({
        name: 'cancelled_at',
        type: 'datetime',
        precision: 6,
        nullable: true,
    })
    cancelledAt!: Date | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime',
        precision: 6,
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt!: Date;
}