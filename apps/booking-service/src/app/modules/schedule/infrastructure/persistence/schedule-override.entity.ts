import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { ScheduleOverrideType } from '../../domain/schedule-override-type.enum';

@Entity('doctor_schedule_overrides')
export class ScheduleOverrideOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'doctor_id', type: 'uuid' })
    doctorId!: string;

    @Column({ name: 'clinic_id', type: 'uuid', nullable: true })
    clinicId!: string | null;

    @Column({ type: 'date' })
    date!: string;

    @Column({
        type: 'enum',
        enum: ScheduleOverrideType,
    })
    type!: ScheduleOverrideType;

    @Column({ name: 'start_time', type: 'varchar', length: 5, nullable: true })
    startTime!: string | null;

    @Column({ name: 'end_time', type: 'varchar', length: 5, nullable: true })
    endTime!: string | null;

    @Column({ type: 'varchar', length: 255, nullable: true })
    reason!: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}