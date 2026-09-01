import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentSource } from '../../domain/appointment-source.enum';
import { AppointmentStatusHistoryOrmEntity } from './appointment-status-history.entity';

@Entity('appointments')
@Index('idx_appointments_doctor_time', ['doctorId', 'startAt', 'endAt'])
export class AppointmentOrmEntity {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    appointmentNo: string;

    @Column({ type: 'varchar', length: 36 })
    patientId: string;

    @Column({ type: 'varchar', length: 36 })
    doctorId: string;

    @Column({ type: 'varchar', length: 36, nullable: true })
    treatmentId: string | null;

    @Column({
        type: 'enum',
        enum: AppointmentSource,
        default: AppointmentSource.Reception,
    })
    source: AppointmentSource;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.Requested,
    })
    status: AppointmentStatus;

    @Column({ type: 'datetime' })
    startAt: Date;

    @Column({ type: 'datetime' })
    endAt: Date;

    @Column({ type: 'text', nullable: true })
    note: string | null;

    @Column({ type: 'text', nullable: true })
    cancelReason: string | null;

    @OneToMany(
        () => AppointmentStatusHistoryOrmEntity,
        history => history.appointment,
        {
            cascade: true,
            eager: true,
        },
    )
    histories: AppointmentStatusHistoryOrmEntity[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt: Date;
}