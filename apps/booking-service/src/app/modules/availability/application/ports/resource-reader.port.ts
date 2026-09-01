export const RESOURCE_READER_PORT = Symbol('RESOURCE_READER_PORT');

export interface ResourceReaderPort {
    doctorExists(doctorId: string): Promise<boolean>;

    getDoctorDefaultAppointmentDurationMinutes(
        doctorId: string,
    ): Promise<number | null>;
}