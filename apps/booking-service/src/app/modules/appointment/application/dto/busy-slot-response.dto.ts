import { AppointmentStatus } from '../../domain/appointment-status.enum';
import { BusySlot } from '../ports/appointment-query.repository';

export class BusySlotResponseDto {
    appointmentId: string;
    appointmentNo: string;
    doctorId: string;
    patientId: string;
    status: AppointmentStatus;
    startAt: string;
    endAt: string;

    static fromBusySlot(slot: BusySlot): BusySlotResponseDto {
        return {
            appointmentId: slot.appointmentId,
            appointmentNo: slot.appointmentNo,
            doctorId: slot.doctorId,
            patientId: slot.patientId,
            status: slot.status,
            startAt: slot.startAt.toISOString(),
            endAt: slot.endAt.toISOString(),
        };
    }
}