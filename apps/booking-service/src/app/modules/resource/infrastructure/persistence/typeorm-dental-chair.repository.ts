import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DentalChairAggregate } from '../../domain/dental-chair.aggregate';
import { DentalChairRepository } from '../../application/ports/dental-chair.repository';

import { DentalChairMapper } from './dental-chair.mapper';
import { DentalChairOrmEntity } from './dental-chair.orm-entity';

@Injectable()
export class TypeOrmDentalChairRepository implements DentalChairRepository {
    constructor(
        @InjectRepository(DentalChairOrmEntity)
        private readonly repository: Repository<DentalChairOrmEntity>,
    ) { }

    async save(chair: DentalChairAggregate): Promise<DentalChairAggregate> {
        const entity = DentalChairMapper.toOrm(chair);

        const saved = await this.repository.save(entity);

        return DentalChairMapper.toDomain(saved);
    }

    async findById(id: string): Promise<DentalChairAggregate | null> {
        const entity = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!entity) {
            return null;
        }

        return DentalChairMapper.toDomain(entity);
    }

    async findByCode(
        code: string,
        clinicId: string | null,
    ): Promise<DentalChairAggregate | null> {
        const query = this.repository
            .createQueryBuilder('chair')
            .where('chair.code = :code', {
                code,
            });

        if (clinicId) {
            query.andWhere('chair.clinicId = :clinicId', {
                clinicId,
            });
        } else {
            query.andWhere('chair.clinicId IS NULL');
        }

        const entity = await query.getOne();

        if (!entity) {
            return null;
        }

        return DentalChairMapper.toDomain(entity);
    }

    async existsByCode(
        code: string,
        clinicId: string | null,
        excludeId?: string,
    ): Promise<boolean> {
        const query = this.repository
            .createQueryBuilder('chair')
            .where('chair.code = :code', {
                code,
            });

        if (clinicId) {
            query.andWhere('chair.clinicId = :clinicId', {
                clinicId,
            });
        } else {
            query.andWhere('chair.clinicId IS NULL');
        }

        if (excludeId) {
            query.andWhere('chair.id != :excludeId', {
                excludeId,
            });
        }

        const count = await query.getCount();

        return count > 0;
    }
}