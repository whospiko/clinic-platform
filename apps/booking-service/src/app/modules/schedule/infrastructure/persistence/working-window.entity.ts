import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

import { ScheduleTemplateOrmEntity } from './schedule-template.entity';

@Entity('doctor_working_windows')
export class WorkingWindowOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'template_id', type: 'uuid' })
    templateId!: string;

    @ManyToOne(() => ScheduleTemplateOrmEntity, (template) => template.workingWindows, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'template_id' })
    template!: ScheduleTemplateOrmEntity;

    @Column({ name: 'day_of_week', type: 'tinyint' })
    dayOfWeek!: number;

    @Column({ name: 'start_time', type: 'varchar', length: 5 })
    startTime!: string;

    @Column({ name: 'end_time', type: 'varchar', length: 5 })
    endTime!: string;

    @Column({ name: 'slot_duration_minutes', type: 'int' })
    slotDurationMinutes!: number;

    @Column({ type: 'int', default: 1 })
    capacity!: number;
}