import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AppointmentController } from './presentation/appointment.controller';
import { TypeOrmAppointmentRepository } from './infrastructure/persistence/typeorm-appointment.repository';

import {
    APPOINTMENT_REPOSITORY,
} from './application/ports/appointment.repository';

import {
    AVAILABILITY_CHECKER,
} from './application/ports/availability-checker.port';

import {
    APPOINTMENT_NO_GENERATOR,
} from './application/ports/appointment-no-generator.port';

import {
    PATIENT_VALIDATOR,
} from './application/ports/patient-validator.port';

import {
    DOCTOR_VALIDATOR,
} from './application/ports/doctor-validator.port';

import {
    TREATMENT_READER,
} from './application/ports/treatment-reader.port';

import { AppointmentNoGenerator } from './infrastructure/generators/appointment-no.generator';

import { PatientHttpClient } from './infrastructure/clients/patient-http.client';
import { DoctorHttpClient } from './infrastructure/clients/doctor-http.client';
import { TreatmentHttpClient } from './infrastructure/clients/treatment-http.client';

import { CreateAppointmentHandler } from './application/handlers/create-appointment.handler';
import { ConfirmAppointmentHandler } from './application/handlers/confirm-appointment.handler';
import { CancelAppointmentHandler } from './application/handlers/cancel-appointment.handler';
import { RescheduleAppointmentHandler } from './application/handlers/reschedule-appointment.handler';
import { CompleteAppointmentHandler } from './application/handlers/complete-appointment.handler';

const commandHandlers = [
    CreateAppointmentHandler,
    ConfirmAppointmentHandler,
    CancelAppointmentHandler,
    RescheduleAppointmentHandler,
    CompleteAppointmentHandler,
];

@Module({
    imports: [
        CqrsModule,
        // TypeOrmModule.forFeature([
        //     AppointmentOrmEntity,
        //     AppointmentStatusHistoryOrmEntity,
        // ]),
    ],
    controllers: [AppointmentController],
    providers: [
        ...commandHandlers,

        TypeOrmAppointmentRepository,
        {
            provide: APPOINTMENT_REPOSITORY,
            useExisting: TypeOrmAppointmentRepository,
        },
        {
            provide: AVAILABILITY_CHECKER,
            useExisting: TypeOrmAppointmentRepository,
        },

        {
            provide: APPOINTMENT_NO_GENERATOR,
            useClass: AppointmentNoGenerator,
        },
        {
            provide: PATIENT_VALIDATOR,
            useClass: PatientHttpClient,
        },
        {
            provide: DOCTOR_VALIDATOR,
            useClass: DoctorHttpClient,
        },
        {
            provide: TREATMENT_READER,
            useClass: TreatmentHttpClient,
        },
    ],
})
export class AppointmentModule { }