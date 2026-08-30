import { Inject, BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'crypto';

import { CreateAppointmentCommand } from '../commands/create-appointment.command';
import { AppointmentAggregate } from '../../domain/appointment.aggregate';
import { AppointmentResponseDto } from '../dto/appointment-response.dto';

import {
    APPOINTMENT_REPOSITORY,
    AppointmentRepository,
} from '../ports/appointment.repository';

import {
    APPOINTMENT_NO_GENERATOR,
    AppointmentNoGeneratorPort,
} from '../ports/appointment-no-generator.port';

import {
    AVAILABILITY_CHECKER,
    AvailabilityCheckerPort,
} from '../ports/availability-checker.port';

import {
    PATIENT_VALIDATOR,
    PatientValidatorPort,
} from '../ports/patient-validator.port';

import {
    DOCTOR_VALIDATOR,
    DoctorValidatorPort,
} from '../ports/doctor-validator.port';

import {
    TREATMENT_READER,
    TreatmentReaderPort,
} from '../ports/treatment-reader.port';

@CommandHandler(CreateAppointmentCommand)
export class CreateAppointmentHandler
    implements ICommandHandler<CreateAppointmentCommand, AppointmentResponseDto> {
    constructor(
        @Inject(APPOINTMENT_REPOSITORY)
        private readonly appointmentRepository: AppointmentRepository,

        @Inject(APPOINTMENT_NO_GENERATOR)
        private readonly appointmentNoGenerator: AppointmentNoGeneratorPort,

        @Inject(AVAILABILITY_CHECKER)
        private readonly availabilityChecker: AvailabilityCheckerPort,

        @Inject(PATIENT_VALIDATOR)
        private readonly patientValidator: PatientValidatorPort,

        @Inject(DOCTOR_VALIDATOR)
        private readonly doctorValidator: DoctorValidatorPort,

        @Inject(TREATMENT_READER)
        private readonly treatmentReader: TreatmentReaderPort,
    ) { }

    async execute(command: CreateAppointmentCommand): Promise<AppointmentResponseDto> {
        await this.patientValidator.ensurePatientExists(command.patientId);
        await this.doctorValidator.ensureDoctorExists(command.doctorId);

        const endAt = await this.resolveEndAt(command);

        await this.availabilityChecker.assertDoctorAvailable({
            doctorId: command.doctorId,
            startAt: command.startAt,
            endAt,
        });

        const appointment = AppointmentAggregate.schedule({
            id: randomUUID(),
            appointmentNo: await this.appointmentNoGenerator.generate(),
            patientId: command.patientId,
            doctorId: command.doctorId,
            treatmentId: command.treatmentId,
            source: command.source,
            startAt: command.startAt,
            endAt,
            note: command.note,
        });

        await this.appointmentRepository.save(appointment);

        return AppointmentResponseDto.fromDomain(appointment);
    }

    private async resolveEndAt(command: CreateAppointmentCommand): Promise<Date> {
        if (command.endAt) {
            return command.endAt;
        }

        if (command.treatmentId) {
            const treatment = await this.treatmentReader.getTreatment(command.treatmentId);

            if (!treatment) {
                throw new BadRequestException('Treatment does not exist.');
            }

            return new Date(command.startAt.getTime() + treatment.durationMinutes * 60_000);
        }

        return new Date(command.startAt.getTime() + 30 * 60_000);
    }
}