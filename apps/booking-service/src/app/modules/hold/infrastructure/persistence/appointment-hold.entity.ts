import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AppointmentHoldStatus } from '../../domain/appointment-hold-status.enum';

@Entity('appointment_holds')
@Index('idx_appointment_holds_doctor_time', ['doctorId', 'startAt', 'endAt'])
@Index('idx_appointment_holds_resource_time', ['resourceId', 'startAt', 'endAt'])
@Index('idx_appointment_holds_status_expires', ['status', 'expiresAt'])
export class AppointmentHoldOrmEntity {
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
        nullable: true,
    })
    patientId!: string | null;

    @Column({
        name: 'resource_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    resourceId!: string | null;

    @Column({
        name: 'appointment_id',
        type: 'varchar',
        length: 36,
        nullable: true,
    })
    appointmentId!: string | null;

    @Column({
        name: 'start_at',
        type: 'datetime',
        precision: 3,
    })
    startAt!: Date;

    @Column({
        name: 'end_at',
        type: 'datetime',
        precision: 3,
    })
    endAt!: Date;

    @Column({
        name: 'expires_at',
        type: 'datetime',
        precision: 3,
    })
    expiresAt!: Date;

    @Column({
        type: 'varchar',
        length: 30,
    })
    status!: AppointmentHoldStatus;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true,
    })
    reason!: string | null;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime',
        precision: 3,
        default: () => 'CURRENT_TIMESTAMP(3)',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime',
        precision: 3,
        default: () => 'CURRENT_TIMESTAMP(3)',
        onUpdate: 'CURRENT_TIMESTAMP(3)',
    })
    updatedAt!: Date;
}