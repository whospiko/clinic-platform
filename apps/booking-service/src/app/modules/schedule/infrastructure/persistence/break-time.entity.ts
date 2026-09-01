import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';

import { ScheduleTemplateOrmEntity } from './schedule-template.entity';

@Entity('doctor_break_times')
export class BreakTimeOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'template_id', type: 'uuid' })
    templateId!: string;

    @ManyToOne(() => ScheduleTemplateOrmEntity, (template) => template.breakTimes, {
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

    @Column({ type: 'varchar', length: 255, nullable: true })
    reason!: string | null;
}