import { AppointmentResponseDto } from './appointment-response.dto';

export class PaginatedAppointmentResponseDto {
    items: AppointmentResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}