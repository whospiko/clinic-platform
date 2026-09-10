import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PatientModule } from '../patient/patient.module';
import { CreatePatientNoteHandler } from './application/handlers/create-patient-note.handler';
import { DeletePatientNoteHandler } from './application/handlers/delete-patient-note.handler';
import { ListPatientNotesHandler } from './application/handlers/list-patient-notes.handler';
import { UpdatePatientNoteHandler } from './application/handlers/update-patient-note.handler';
import { PatientNoteOrmEntity } from './infrastructure/persistence/patient-note.orm-entity';
import { TypeOrmPatientNoteRepository } from './infrastructure/persistence/typeorm-patient-note.repository';
import { PatientNoteController } from './presentation/patient-note.controller';
import { PATIENT_NOTE_REPOSITORY } from './patient-note.tokens';

const handlers = [
  CreatePatientNoteHandler,
  UpdatePatientNoteHandler,
  DeletePatientNoteHandler,
  ListPatientNotesHandler,
];

@Module({
  imports: [
    CqrsModule,
    PatientModule,
    TypeOrmModule.forFeature([PatientNoteOrmEntity]),
  ],
  controllers: [PatientNoteController],
  providers: [
    ...handlers,
    {
      provide: PATIENT_NOTE_REPOSITORY,
      useClass: TypeOrmPatientNoteRepository,
    },
  ],
  exports: [PATIENT_NOTE_REPOSITORY],
})
export class PatientNoteModule {}
