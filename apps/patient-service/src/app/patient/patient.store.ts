import { Injectable } from '@nestjs/common';
import { Patient } from './patient.type';

@Injectable()
export class PatientStore {
  private readonly patients: Patient[] = [
    {
      id: 'patient-001',
      code: 'P-0001',
      firstName: 'Sok',
      lastName: 'Dara',
      phone: '012345678',
      email: 'sok@example.com',
    },
    {
      id: 'patient-002',
      code: 'P-0002',
      firstName: 'Chan',
      lastName: 'Bopha',
      phone: '098765432',
      email: 'bopha@example.com',
    },
  ];

  findAll(): Patient[] {
    return this.patients;
  }

  findById(id: string): Patient | undefined {
    return this.patients.find((patient) => patient.id === id);
  }
}