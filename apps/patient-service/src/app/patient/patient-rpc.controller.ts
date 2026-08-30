import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientStore } from './patient.store';

type FindPatientForBookingPayload = {
    patientId: string;
};

@Controller()
export class PatientRpcController {
    constructor(private readonly patientStore: PatientStore) { }

    @MessagePattern({ cmd: 'patient.findForBooking' })
    findForBooking(@Payload() payload: FindPatientForBookingPayload) {
        const patient = this.patientStore.findById(payload.patientId);

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        return {
            id: patient.id,
            code: patient.code,
            fullName: `${patient.firstName} ${patient.lastName}`,
            phone: patient.phone,
            email: patient.email,
        };
    }
}