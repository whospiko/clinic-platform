import { DentalChairAggregate } from '../../domain/dental-chair.aggregate';
import { DentalChairReadModel } from '../../application/dto/dental-chair-read-model';

import { DentalChairOrmEntity } from './dental-chair.orm-entity';

export class DentalChairMapper {
    static toDomain(entity: DentalChairOrmEntity): DentalChairAggregate {
        return DentalChairAggregate.rehydrate({
            id: entity.id,
            clinicId: entity.clinicId,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }

    static toOrm(domain: DentalChairAggregate): DentalChairOrmEntity {
        const entity = new DentalChairOrmEntity();

        entity.id = domain.id;
        entity.clinicId = domain.clinicId;
        entity.code = domain.code;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.status = domain.status;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;

        return entity;
    }

    static toReadModel(entity: DentalChairOrmEntity): DentalChairReadModel {
        return {
            id: entity.id,
            clinicId: entity.clinicId,
            code: entity.code,
            name: entity.name,
            description: entity.description,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        };
    }
}