export const APPOINTMENT_NO_GENERATOR = Symbol('APPOINTMENT_NO_GENERATOR');

export interface AppointmentNoGeneratorPort {
    generate(): Promise<string>;
}