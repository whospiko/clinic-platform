import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import {
    FindDentalChairsFilter,
    ResourceReaderPort,
} from '../../application/ports/resource-reader.port';
import { DentalChairReadModel } from '../../application/dto/dental-chair-read-model';
import { DentalChairStatus } from '../../domain/dental-chair-status.enum';

import { DentalChairMapper } from './dental-chair.mapper';
import { DentalChairOrmEntity } from './dental-chair.orm-entity';

@Injectable()
export class TypeOrmResourceReader implements ResourceReaderPort {
    constructor(
        @InjectRepository(DentalChairOrmEntity)
        private readonly repository: Repository<DentalChairOrmEntity>,
    ) { }

    async findDentalChairById(id: string): Promise<DentalChairReadModel | null> {
        const entity = await this.repository.findOne({
            where: {
                id,
            },
        });

        if (!entity) {
            return null;
        }

        return DentalChairMapper.toReadModel(entity);
    }

    async findDentalChairs(
        filter?: FindDentalChairsFilter,
    ): Promise<DentalChairReadModel[]> {
        const query = this.repository
            .createQueryBuilder('chair')
            .orderBy('chair.code', 'ASC');

        if (filter?.clinicId !== undefined) {
            if (filter.clinicId) {
                query.andWhere('chair.clinicId = :clinicId', {
                    clinicId: filter.clinicId,
                });
            } else {
                query.andWhere('chair.clinicId IS NULL');
            }
        }

        if (filter?.status) {
            query.andWhere('chair.status = :status', {
                status: filter.status,
            });
        }

        const entities = await query.getMany();

        return entities.map(DentalChairMapper.toReadModel);
    }

    async isDentalChairActive(id: string): Promise<boolean> {
        const count = await this.repository.count({
            where: {
                id,
                status: DentalChairStatus.ACTIVE,
            },
        });

        return count > 0;
    }
}