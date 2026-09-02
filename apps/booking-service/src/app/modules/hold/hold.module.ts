import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppointmentHoldController } from './presentation/appointment-hold.controller';

import { AppointmentHoldOrmEntity } from './infrastructure/persistence/appointment-hold.entity';
import { TypeOrmAppointmentHoldRepository } from './infrastructure/persistence/typeorm-appointment-hold.repository';
import { TypeOrmHoldBlockReader } from './infrastructure/persistence/typeorm-hold-block-reader';

import { CreateAppointmentHoldHandler } from './application/handlers/create-appointment-hold.handler';
import { ConfirmAppointmentHoldHandler } from './application/handlers/confirm-appointment-hold.handler';
import { CancelAppointmentHoldHandler } from './application/handlers/cancel-appointment-hold.handler';
import { ExpireAppointmentHoldHandler } from './application/handlers/expire-appointment-hold.handler';

import { APPOINTMENT_HOLD_REPOSITORY } from './application/ports/appointment-hold.repository';
import { HOLD_BLOCK_READER } from './application/ports/hold-block-reader.port';

const CommandHandlers = [
    CreateAppointmentHoldHandler,
    ConfirmAppointmentHoldHandler,
    CancelAppointmentHoldHandler,
    ExpireAppointmentHoldHandler,
];

@Module({
    imports: [CqrsModule, TypeOrmModule.forFeature([AppointmentHoldOrmEntity])],
    controllers: [AppointmentHoldController],
    providers: [
        ...CommandHandlers,
        {
            provide: APPOINTMENT_HOLD_REPOSITORY,
            useClass: TypeOrmAppointmentHoldRepository,
        },
        {
            provide: HOLD_BLOCK_READER,
            useClass: TypeOrmHoldBlockReader,
        },
    ],
    exports: [
        /**
         * Export only reader port for loose coupling.
         * Availability module can inject HOLD_BLOCK_READER.
         */
        HOLD_BLOCK_READER,
    ],
})
export class HoldModule { }