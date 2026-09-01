import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

@Entity('dental_chairs')
@Index('idx_dental_chairs_clinic_id', ['clinicId'])
@Index('idx_dental_chairs_status', ['status'])
@Index('uq_dental_chairs_clinic_code', ['clinicId', 'code'], {
    unique: true,
})
export class DentalChairOrmEntity {
    @PrimaryColumn({
        type: 'char',
        length: 36,
    })
    id!: string;

    @Column({
        name: 'clinic_id',
        type: 'char',
        length: 36,
        nullable: true,
    })
    clinicId!: string | null;

    @Column({
        type: 'varchar',
        length: 50,
    })
    code!: string;

    @Column({
        type: 'varchar',
        length: 150,
    })
    name!: string;

    @Column({
        type: 'varchar',
        length: 500,
        nullable: true,
    })
    description!: string | null;

    @Column({
        type: 'enum',
        enum: DentalChairStatus,
        default: DentalChairStatus.ACTIVE,
    })
    status!: DentalChairStatus;

    @CreateDateColumn({
        name: 'created_at',
        type: 'datetime',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'datetime',
    })
    updatedAt!: Date;
}