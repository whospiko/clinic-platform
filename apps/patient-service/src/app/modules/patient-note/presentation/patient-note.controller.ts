import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreatePatientNoteCommand } from '../application/commands/create-patient-note.command';
import { DeletePatientNoteCommand } from '../application/commands/delete-patient-note.command';
import { UpdatePatientNoteCommand } from '../application/commands/update-patient-note.command';
import { PatientNoteReadModel } from '../application/dto/patient-note-read-model';
import { ListPatientNotesQuery } from '../application/queries/list-patient-notes.query';
import { CreatePatientNoteRequest } from './dto/create-patient-note.request';
import { ListPatientNotesRequest } from './dto/list-patient-notes.request';
import { UpdatePatientNoteRequest } from './dto/update-patient-note.request';

@ApiTags('Patient Notes')
@Controller()
export class PatientNoteController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('patients/:patientId/notes')
  @ApiOperation({ summary: 'Create patient note' })
  @ApiCreatedResponse({ description: 'Patient note created' })
  create(
    @Param('patientId') patientId: string,
    @Body() body: CreatePatientNoteRequest,
  ): Promise<PatientNoteReadModel> {
    return this.commandBus.execute(
      new CreatePatientNoteCommand(patientId, body),
    );
  }

  @Get('patients/:patientId/notes')
  @ApiOperation({ summary: 'List patient notes' })
  @ApiOkResponse({ description: 'Patient notes' })
  list(
    @Param('patientId') patientId: string,
    @Query() query: ListPatientNotesRequest,
  ): Promise<PatientNoteReadModel[]> {
    return this.queryBus.execute(
      new ListPatientNotesQuery(patientId, query.type),
    );
  }

  @Patch('patient-notes/:id')
  @ApiOperation({ summary: 'Update patient note' })
  update(
    @Param('id') id: string,
    @Body() body: UpdatePatientNoteRequest,
  ): Promise<PatientNoteReadModel> {
    return this.commandBus.execute(new UpdatePatientNoteCommand(id, body));
  }

  @Delete('patient-notes/:id')
  @ApiOperation({ summary: 'Soft delete patient note' })
  delete(@Param('id') id: string): Promise<{ deleted: true }> {
    return this.commandBus.execute(new DeletePatientNoteCommand(id));
  }
}
