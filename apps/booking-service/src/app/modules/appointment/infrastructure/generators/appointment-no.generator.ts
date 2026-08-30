import { Injectable } from '@nestjs/common';
import { AppointmentNoGeneratorPort } from '../../application/ports/appointment-no-generator.port';

@Injectable()
export class AppointmentNoGenerator implements AppointmentNoGeneratorPort {
    async generate(): Promise<string> {
        const now = new Date();

        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');

        const random = Math.floor(Math.random() * 999999)
            .toString()
            .padStart(6, '0');

        return `APT-${yyyy}${mm}${dd}-${random}`;
    }
}