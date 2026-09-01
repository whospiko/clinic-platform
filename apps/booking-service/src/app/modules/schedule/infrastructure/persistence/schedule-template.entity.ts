import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { WorkingWindowOrmEntity } from './working-window.entity';
import { BreakTimeOrmEntity } from './break-time.entity';

@Entity('doctor_schedule_templates')
export class ScheduleTemplateOrmEntity {
    @PrimaryColumn('uuid')
    id!: string;

    @Column({ name: 'doctor_id', type: 'uuid' })
    doctorId!: string;

    @Column({ name: 'clinic_id', type: 'uuid', nullable: true })
    clinicId!: string | null;

    @Column({ type: 'varchar', length: 80 })
    timezone!: string;

    @Column({ name: 'effective_from', type: 'date' })
    effectiveFrom!: string;

    @Column({ name: 'effective_to', type: 'date', nullable: true })
    effectiveTo!: string | null;

    @Column({ name: 'is_active', type: 'boolean', default: true })
    isActive!: boolean;

    @OneToMany(() => WorkingWindowOrmEntity, (window) => window.template, {
        cascade: true,
        eager: true,
    })
    workingWindows!: WorkingWindowOrmEntity[];

    @OneToMany(() => BreakTimeOrmEntity, (breakTime) => breakTime.template, {
        cascade: true,
        eager: true,
    })
    breakTimes!: BreakTimeOrmEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;
}