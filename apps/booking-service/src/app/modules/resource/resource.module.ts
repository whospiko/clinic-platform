import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DentalChairRepository } from './application/ports/dental-chair.repository';
import { ResourceReaderPort } from './application/ports/resource-reader.port';

import { CreateDentalChairHandler } from './application/handlers/create-dental-chair.handler';
import { UpdateDentalChairHandler } from './application/handlers/update-dental-chair.handler';
import { ChangeDentalChairStatusHandler } from './application/handlers/change-dental-chair-status.handler';

import { DentalChairOrmEntity } from './infrastructure/persistence/dental-chair.orm-entity';
import { TypeOrmDentalChairRepository } from './infrastructure/persistence/typeorm-dental-chair.repository';
import { TypeOrmResourceReader } from './infrastructure/persistence/typeorm-resource-reader';

import { DentalChairController } from './presentation/dental-chair.controller';

const commandHandlers = [
    CreateDentalChairHandler,
    UpdateDentalChairHandler,
    ChangeDentalChairStatusHandler,
];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([DentalChairOrmEntity]),
    ],
    controllers: [DentalChairController],
    providers: [
        ...commandHandlers,
        {
            provide: DentalChairRepository,
            useClass: TypeOrmDentalChairRepository,
        },
        {
            provide: ResourceReaderPort,
            useClass: TypeOrmResourceReader,
        },
    ],
    exports: [ResourceReaderPort],
})
export class ResourceModule { }