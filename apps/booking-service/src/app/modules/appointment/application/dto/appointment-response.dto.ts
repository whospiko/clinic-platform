import { AppointmentSource } from "../../domain/appointment-source.enum";
import { AppointmentStatus } from "../../domain/appointment-status.enum";
import { AppointmentAggregate } from "../../domain/appointment.aggregate";

export class AppointmentResponseDto {
    id: string;
    appointmentNo: string;
    patientId: string;
    doctorId: string;
    treatmentId: string | null;
    source: AppointmentSource;
    status: AppointmentStatus;
    startAt: string;
    endAt: string;
    note: string | null;
    cancelReason: string | null;
    createdAt: string;
    updatedAt: string;

    static fromDomain(appointment: AppointmentAggregate): AppointmentResponseDto {
        return {
            id: appointment.getId(),
            appointmentNo: appointment.getAppointmentNo(),
            patientId: appointment.getPatientId(),
            doctorId: appointment.getDoctorId(),
            treatmentId: appointment.getTreatmentId(),
            source: appointment.getSource(),
            status: appointment.getStatus(),
            startAt: appointment.getStartAt().toISOString(),
            endAt: appointment.getEndAt().toISOString(),
            note: appointment.getNote(),
            cancelReason: appointment.getCancelReason(),
            createdAt: appointment.getCreatedAt().toISOString(),
            updatedAt: appointment.getUpdatedAt().toISOString(),
        };
    }
}