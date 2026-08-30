import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { AppointmentOrmEntity } from './appointment.orm-entity';

@Entity('appointment_status_histories')
export class AppointmentStatusHistoryOrmEntity {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 36 })
    appointmentId: string;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        nullable: true,
    })
    fromStatus: AppointmentStatus | null;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
    })
    toStatus: AppointmentStatus;

    @Column({ type: 'text', nullable: true })
    reason: string | null;

    @Column({ type: 'datetime' })
    changedAt: Date;

    @ManyToOne(
        () => AppointmentOrmEntity,
        appointment => appointment.histories,
        {
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({ name: 'appointmentId' })
    appointment: AppointmentOrmEntity;
}