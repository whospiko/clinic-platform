import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DoctorScheduleController } from './presentation/doctor-schedule.controller';

import { ScheduleTemplateOrmEntity } from './infrastructure/persistence/schedule-template.entity';
import { WorkingWindowOrmEntity } from './infrastructure/persistence/working-window.entity';
import { BreakTimeOrmEntity } from './infrastructure/persistence/break-time.entity';
import { ScheduleOverrideOrmEntity } from './infrastructure/persistence/schedule-override.entity';

import { TypeOrmScheduleTemplateRepository } from './infrastructure/persistence/typeorm-schedule-template.repository';
import { TypeOrmScheduleOverrideRepository } from './infrastructure/persistence/typeorm-schedule-override.repository';
import { TypeOrmScheduleReader } from './infrastructure/persistence/typeorm-schedule-reader';

import {
    SCHEDULE_TEMPLATE_REPOSITORY,
} from './application/ports/schedule-template.repository';
import {
    SCHEDULE_OVERRIDE_REPOSITORY,
} from './application/ports/schedule-override.repository';
import {
    SCHEDULE_READER_PORT,
} from './application/ports/schedule-reader.port';

import { CreateScheduleTemplateHandler } from './application/handlers/create-schedule-template.handler';
import { AddWorkingWindowHandler } from './application/handlers/add-working-window.handler';
import { AddBreakTimeHandler } from './application/handlers/add-break-time.handler';
import { CreateScheduleOverrideHandler } from './application/handlers/create-schedule-override.handler';
import { DeleteScheduleOverrideHandler } from './application/handlers/delete-schedule-override.handler';

const commandHandlers = [
    CreateScheduleTemplateHandler,
    AddWorkingWindowHandler,
    AddBreakTimeHandler,
    CreateScheduleOverrideHandler,
    DeleteScheduleOverrideHandler,
];

@Module({
    imports: [
        CqrsModule,
        TypeOrmModule.forFeature([
            ScheduleTemplateOrmEntity,
            WorkingWindowOrmEntity,
            BreakTimeOrmEntity,
            ScheduleOverrideOrmEntity,
        ]),
    ],
    controllers: [DoctorScheduleController],
    providers: [
        ...commandHandlers,

        {
            provide: SCHEDULE_TEMPLATE_REPOSITORY,
            useClass: TypeOrmScheduleTemplateRepository,
        },
        {
            provide: SCHEDULE_OVERRIDE_REPOSITORY,
            useClass: TypeOrmScheduleOverrideRepository,
        },
        {
            provide: SCHEDULE_READER_PORT,
            useClass: TypeOrmScheduleReader,
        },
    ],
    exports: [
        SCHEDULE_READER_PORT,
        SCHEDULE_TEMPLATE_REPOSITORY,
        SCHEDULE_OVERRIDE_REPOSITORY,
    ],
})
export class ScheduleModule { }